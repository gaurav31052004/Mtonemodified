import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync, statSync, writeFileSync, copyFileSync } from "fs";
import { join, extname, relative } from "path";
import tailwindcss from "@tailwindcss/vite";
import glob from "fast-glob";

// Function to discover all HTML files
function discoverHtmlFiles() {
  const htmlFiles = glob.sync(
    [
      "./index.html", // Root level index.html
      "./pages/**/*.html", // HTML files inside pages folder
    ],
    {
      ignore: ["node_modules/**", "dist/**", ".git/**", "coverage/**"],
    },
  );

  console.log("🔍 Discovered HTML files:", htmlFiles);

  return htmlFiles;
}

// Function to create input object for Vite
function createInputObject() {
  const htmlFiles = discoverHtmlFiles();
  const inputs = {};

  htmlFiles.forEach((file) => {
    // Generate key from file path
    let key;
    if (file === "./index.html") {
      key = "main";
    } else if (file.startsWith("./pages/")) {
      // For pages folder files, remove ./pages/ prefix and .html extension
      key = file.replace("./pages/", "").replace(".html", "").replace(/\//g, "-");
    } else {
      // Fallback for other files
      key = file.replace("./", "").replace(".html", "").replace(/\//g, "-");
    }

    inputs[key] = resolve(__dirname, file);
  });

  console.log("📝 Generated input object:", inputs);
  return inputs;
}

// Function to extract routes from HTML files
function extractRoutes() {
  const htmlFiles = discoverHtmlFiles();
  const routes = [];

  htmlFiles.forEach((file) => {
    if (file === "./index.html") {
      return; // Skip index.html as it's the root
    }

    if (file.startsWith("./pages/")) {
      // Convert pages/filename.html to just filename for the route
      // This handles both flat files and nested folders
      let route = file.replace("./pages/", "").replace(".html", "");
      routes.push(route);
    }
  });

  console.log("🛤️  Extracted routes:", routes);
  return routes;
}

// Function to generate web.config content
function generateWebConfig(routes) {
  if (routes.length === 0) {
    console.warn("⚠️ No routes found, using default pattern");
    return generateDefaultWebConfig();
  }

  // Separate single-level routes from nested routes for better pattern matching
  const singleRoutes = routes.filter(route => !route.includes('/'));
  const nestedRoutes = routes.filter(route => route.includes('/'));
  
  const singleRoutePattern = singleRoutes.length > 0 ? singleRoutes.join("|") : "";
  const nestedRoutePattern = nestedRoutes.length > 0 ? nestedRoutes.map(route => route.replace('/', '\\/')).join("|") : "";

  return `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Serve robots.txt directly -->
        <rule name="Robots.txt" stopProcessing="true">
          <match url="^robots\.txt$" />
          <action type="None" />
        </rule>

        <!-- Serve sitemap.xml directly -->
        <rule name="Sitemap" stopProcessing="true">
          <match url="^sitemap\.xml$" />
          <action type="None" />
        </rule>

        ${nestedRoutes.length > 0 ? `<!-- Remove trailing slash redirects for nested routes -->
        <rule name="Remove trailing slash for nested routes" stopProcessing="true">
          <match url="^(${nestedRoutePattern})/$" />
          <action type="Redirect" url="{R:1}" redirectType="Permanent" />
        </rule>

        <!-- Serve HTML files for nested routes -->
        <rule name="Serve HTML for nested routes" stopProcessing="true">
          <match url="^(${nestedRoutePattern})$" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
          <action type="Rewrite" url="pages/{R:1}.html" />
        </rule>` : ''}

        ${singleRoutes.length > 0 ? `<!-- Remove trailing slash redirects for single-level routes -->
        <rule name="Remove trailing slash for single routes" stopProcessing="true">
          <match url="^(${singleRoutePattern})/$" />
          <action type="Redirect" url="{R:1}" redirectType="Permanent" />
        </rule>

        <!-- Serve HTML files for single-level routes -->
        <rule name="Serve HTML for single routes" stopProcessing="true">
          <match url="^(${singleRoutePattern})$" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
          <action type="Rewrite" url="pages/{R:1}.html" />
        </rule>` : ''}

        <!-- Handle static assets from root directory -->
        <rule name="Static Assets" stopProcessing="true">
          <match url="^(css|js|images|assets|fonts|media)/.*" />
          <action type="None" />
        </rule>

        <!-- Fallback to root index.html -->
        <rule name="Fallback to root index" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(css|js|images|assets|fonts|media)/.*" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/robots\.txt$" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/sitemap\.xml$" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/favicon\.ico$" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>

    <!-- MIME types for proper file serving -->
    <staticContent>
      <remove fileExtension=".js" />
      <mimeMap fileExtension=".js" mimeType="application/javascript" />
      <remove fileExtension=".css" />
      <mimeMap fileExtension=".css" mimeType="text/css" />
      <remove fileExtension=".json" />
      <mimeMap fileExtension=".json" mimeType="application/json" />
      <remove fileExtension=".txt" />
      <mimeMap fileExtension=".txt" mimeType="text/plain" />
      <remove fileExtension=".xml" />
      <mimeMap fileExtension=".xml" mimeType="text/xml" />
      <remove fileExtension=".woff" />
      <mimeMap fileExtension=".woff" mimeType="font/woff" />
      <remove fileExtension=".woff2" />
      <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    </staticContent>

    <!-- Enable compression -->
    <urlCompression doStaticCompression="true" doDynamicCompression="true" />

    <!-- Security headers -->
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-Frame-Options" value="SAMEORIGIN" />
        <add name="X-XSS-Protection" value="1; mode=block" />
        <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
      </customHeaders>
    </httpProtocol>

    <!-- Error pages -->
    <httpErrors>
      <clear />
      <error statusCode="404" path="/index.html" responseMode="ExecuteURL" />
      <error statusCode="500" path="/index.html" responseMode="ExecuteURL" />
    </httpErrors>

    <!-- Default documents -->
    <defaultDocument>
      <files>
        <clear />
        <add value="index.html" />
      </files>
    </defaultDocument>

    <!-- Remove server header for security -->
    <security>
      <requestFiltering removeServerHeader="true" />
    </security>
  </system.webServer>
</configuration>`;
}

// Function to generate default web.config when no routes found
function generateDefaultWebConfig() {
  return `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Serve robots.txt directly -->
        <rule name="Robots.txt" stopProcessing="true">
          <match url="^robots\.txt$" />
          <action type="None" />
        </rule>

        <!-- Serve sitemap.xml directly -->
        <rule name="Sitemap" stopProcessing="true">
          <match url="^sitemap\.xml$" />
          <action type="None" />
        </rule>

        <!-- Handle static assets -->
        <rule name="Static Assets" stopProcessing="true">
          <match url="^(css|js|images|assets|fonts|media)/.*" />
          <action type="None" />
        </rule>

        <!-- Fallback to root index.html -->
        <rule name="Fallback to root index" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/(css|js|images|assets|fonts|media)/.*" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/robots\.txt$" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/sitemap\.xml$" negate="true" />
            <add input="{REQUEST_URI}" pattern="^/favicon\.ico$" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>

    <!-- Default documents -->
    <defaultDocument>
      <files>
        <clear />
        <add value="index.html" />
      </files>
    </defaultDocument>
  </system.webServer>
</configuration>`;
}

// Plugin to generate web.config automatically
function webConfigGeneratorPlugin() {
  return {
    name: "web-config-generator",
    writeBundle() {
      const routes = extractRoutes();
      const webConfigContent = generateWebConfig(routes);
      const distPath = resolve(__dirname, "dist/web.config");

      writeFileSync(distPath, webConfigContent);

      // Copy robots.txt to dist
      const robotsSource = resolve(__dirname, "robots.txt");
      const robotsDest = resolve(__dirname, "dist/robots.txt");

      try {
        copyFileSync(robotsSource, robotsDest);
        console.log("✅ robots.txt copied to dist folder");
      } catch (error) {
        console.warn("⚠️ robots.txt not found, creating a default one");
        const defaultRobots = `User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml

Disallow: /admin/
Disallow: /login/
Disallow: /onboarding/`;
        writeFileSync(robotsDest, defaultRobots);
      }

      console.log("✅ web.config generated successfully!");
      console.log(`📋 Routes included: ${routes.join(", ")}`);
    },
  };
}

// Dev server middleware for handling routes
function devServerMiddleware() {
  return {
    name: "dev-server-routes",
    configureServer(server) {
      const routes = extractRoutes();

      // Add a general middleware to handle all route redirects and rewrites
      server.middlewares.use((req, res, next) => {
        const url = req.url;
        const [pathname, queryString] = url.split('?');
        const queryParams = queryString ? `?${queryString}` : '';
        
        // Check if this is a route with trailing slash that should be redirected
        for (const route of routes) {
          if (pathname === `/${route}/`) {
            res.writeHead(301, { Location: `/${route}${queryParams}` });
            res.end();
            return;
          }
          
          // Check if this is a route without trailing slash that should serve HTML from pages folder
          if (pathname === `/${route}`) {
            req.url = `/pages/${route}.html${queryParams}`;
            break;
          }
        }
        
        next();
      });
    },
  };
}

export default defineConfig(({ mode, command }) => {
  // Use the mode to determine if this is a production build
  const isProduction = mode === 'production';
  
  console.log(`🔧 Vite Config - Mode: ${mode}, Command: ${command}, Production: ${isProduction}`);
  
  return {
    plugins: [tailwindcss(), webConfigGeneratorPlugin(), devServerMiddleware()],
    root: ".",
    build: {
      rollupOptions: {
        input: createInputObject(),
      },
    },
    server: {
      open: true,
      port: 3000,
    },
    appType: "mpa", // Multi-page application
    define: {
      // Make the mode available to client-side code
      'import.meta.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
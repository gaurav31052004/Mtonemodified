import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync, statSync, writeFileSync } from "fs";
import { join, extname, relative } from "path";
import tailwindcss from "@tailwindcss/vite";
import glob from "fast-glob";

// Function to discover all HTML files
function discoverHtmlFiles() {
  const htmlFiles = glob.sync(
    [
      "./*.html", // Root level HTML files
      "./**/*.html", // Nested HTML files
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
    } else {
      // Remove ./ prefix and .html extension, replace / with -
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

    // Convert file path to route
    let route = file.replace("./", "").replace(".html", "");

    // Handle nested files
    if (route.includes("/")) {
      routes.push(route);
    } else {
      routes.push(route);
    }
  });

  console.log("🛤️  Extracted routes:", routes);
  return routes;
}

// Function to generate web.config content
function generateWebConfig(routes) {
  const routePattern = routes.length > 0 ? routes.join("|") : "admin";

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

        <!-- Handle trailing slash redirects for HTML file routes -->
        <rule name="Add trailing slash for directories" stopProcessing="true">
          <match url="^(${routePattern})$" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Redirect" url="{R:1}/" redirectType="Permanent" />
        </rule>

        <!-- Serve HTML files for route requests -->
        <rule name="Serve HTML for routes" stopProcessing="true">
          <match url="^(${routePattern})/?$" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
          <action type="Rewrite" url="{R:1}.html" />
        </rule>

        <!-- Handle nested routes (like partners/application) -->
        <rule name="Handle nested routes" stopProcessing="true">
          <match url="^(partners/application)/?$" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
          </conditions>
          <action type="Rewrite" url="{R:1}.html" />
        </rule>

        <!-- Handle static assets -->
        <rule name="Static Assets" stopProcessing="true">
          <match url="^(css|js|images|assets|fonts|media)/.*" />
          <action type="None" />
        </rule>

        <!-- Fallback to root index.html (but exclude robots.txt and sitemap.xml) -->
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

      routes.forEach((route) => {
        // Handle routes without trailing slash
        server.middlewares.use(`/${route}`, (req, res, next) => {
          if (req.url === `/${route}`) {
            res.writeHead(301, { Location: `/${route}/` });
            res.end();
            return;
          }
          next();
        });

        // Handle routes with trailing slash
        server.middlewares.use(`/${route}/`, (req, res, next) => {
          if (req.url === `/${route}/`) {
            req.url = `/${route}.html`;
          }
          next();
        });
      });
    },
  };
}

export default defineConfig({
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
});

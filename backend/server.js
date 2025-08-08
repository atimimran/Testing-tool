// const express = require('express');
// const puppeteer = require('puppeteer');
// const { default: lighthouse } = require('lighthouse');
// const chromeLauncher = require('chrome-launcher');
// const cors = require('cors');
// const rateLimit = require('express-rate-limit');
// const helmet = require('helmet');
// const compression = require('compression');
// const cheerio = require('cheerio');
// const axios = require('axios');
// // const cors = require('cors');
// const fetch = require('node-fetch'); // or built-in fetch if Node v18+

// const app = express();
// // backend/index.js ya app.js mein
// app.use(cors());

// // Middleware
// app.use(cors());
// app.use(helmet({
//   contentSecurityPolicy: false, // Disable for development
// }));
// app.use(compression());
// app.use(express.json());

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 50 // limit each IP to 50 requests per windowMs
// });
// app.use('/api/', limiter);
// // app.post('/api/fetch-html', async (req, res) => {
// //   const { url } = req.body;
// //   if (!url) return res.status(400).json({ error: 'Missing URL' });

// //   try {
// //     const response = await fetch(url);
// //     if (!response.ok) {
// //       return res.status(response.status).json({ error: `Failed to fetch URL: ${response.statusText}` });
// //     }

// //     const html = await response.text();
// //     res.json({ html });
// //     console.log("html",html)
// //   } catch (error) {
// //     console.error('Error fetching HTML:', error);
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // Health check endpoint

// app.post('/api/fetch-html', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Missing URL' });

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       return res.status(response.status).json({ error: `Failed to fetch URL: ${response.statusText}` });
//     }

//     const html = await response.text();
//     res.json({ html });
//     console.log("html",html)
//   } catch (error) {
//     console.error('Error fetching HTML:', error);
//     res.status(500).json({ error: error.message });
//   }
// });


// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });
// async function runLighthouseAnalysis(url) {
//   const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
//   const options = {
//     logLevel: 'info',
//     output: 'json',
//     port: chrome.port
//   };

//   const runnerResult = await lighthouse(url, options);

//   await chrome.kill();

//   const lhr = runnerResult.lhr;
//   return {
//     performance: lhr.categories.performance.score * 100,
//     seo: lhr.categories.seo.score * 100,
//     accessibility: lhr.categories.accessibility?.score * 100,
//     bestPractices: lhr.categories['best-practices']?.score * 100
//   };
// }
// // Main analysis endpoint
// app.post('/api/analyze', async (req, res) => {
//     const { url } = req.body;
//     if (!url) {
//         return res.status(400).json({ error: 'URL is required' });
//     }

//     // Validate URL
//     try {
//         new URL(url);
//     } catch (error) {
//         return res.status(400).json({ error: 'Invalid URL format' });
//     }

//     let browser = null;
//     let chrome = null;

//     try {
//         console.log(`Starting analysis for: ${url}`);
        
//         // Launch Puppeteer browser
//         browser = await puppeteer.launch({
//             headless: 'new',
//             args: [
//                 '--no-sandbox',
//                 '--disable-setuid-sandbox',
//                 '--disable-dev-shm-usage',
//                 '--disable-gpu',
//                 '--no-first-run',
//                 '--no-zygote',
//                 '--single-process'
//             ]
//         });

//         const page = await browser.newPage();
        
//         // Set viewport for mobile/desktop testing
//         await page.setViewport({ width: 1366, height: 768 });
        
//         // Set user agent
//         await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
//         const startTime = Date.now();
        
//         // Navigate to the page
//         const response = await page.goto(url, { 
//             waitUntil: 'networkidle2',
//             timeout: 30000 
//         });
        
//         const loadTime = (Date.now() - startTime) / 1000;
        
//         // Get the rendered HTML content
// console.log("1. HTML fetched");

//         const htmlContent = await page.content();
//         console.log("HTML content length:", htmlContent.length);

//         // Take screenshot
//                 console.log("2. Screenshot taken");

//         const screenshot = await page.screenshot({ 
//             fullPage: true, 
//             type: 'png',
//             encoding: 'base64'
//         });

//         // Get page metrics
//         console.log("3. Metrics captured");

//         const metrics = await page.metrics();
        
//         // Test responsiveness by changing viewport
// console.log("4. Testing responsiveness...");
//         const responsiveness = await testResponsiveness(page, url);
//         console.log("4.1 Responsiveness done");

//         // Perform security analysis
// console.log("5. Running security analysis...");

//         const securityResults = await performSecurityAnalysis(page, htmlContent, url);
//         console.log("5.1 Security done");

//         // Perform SEO analysis
//         console.log("6. Running SEO analysis...");

//         const seoResults = await performSEOAnalysis(htmlContent, page);
//         console.log("6.1 SEO done");

//         // Get performance metrics
//         const performanceResults = {
//             loadTime: loadTime,
//             domContentLoaded: metrics.DOMContentLoaded,
//             firstContentfulPaint: metrics.FirstContentfulPaint,
//             firstMeaningfulPaint: metrics.FirstMeaningfulPaint,
//             size: Buffer.byteLength(htmlContent, 'utf8'),
//             jsHeapUsedSize: metrics.JSHeapUsedSize,
//             jsHeapTotalSize: metrics.JSHeapTotalSize,
//             nodes: metrics.Nodes,
//             documents: metrics.Documents
//         };
        
//         await browser.close();
        
//         // Run Lighthouse analysis
//         console.log('Running Lighthouse analysis...');
//         const lighthouseResults = await runLighthouseAnalysis(url);
//         console.log("7. Running Lighthouse... done");

//         res.json({
//             success: true,
//             url: url,
//             timestamp: new Date().toISOString(),
//             screenshot: `data:image/png;base64,${screenshot}`,
//             performance: {
//                 ...performanceResults,
//                 lighthouse: lighthouseResults.performance
//             },
//             responsiveness: responsiveness,
//             security: securityResults,
//             seo: {
//                 ...seoResults,
//                 lighthouse: lighthouseResults.seo
//             },
//             overallScore: calculateOverallScore(performanceResults, responsiveness, securityResults, seoResults, lighthouseResults)
//         });

//     } catch (error) {
//         console.error('Analysis error:', error);
//         if (browser) {
//             await browser.close();
//         }
//         if (chrome) {
//             await chrome.kill();
//         }
//         res.status(500).json({ 
//             error: 'Analysis failed', 
//             message: error.message,
//             stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//         });
//     }
// });

// // Responsiveness testing function
// async function testResponsiveness(page, url) {
//     const viewports = [
//         { name: 'mobile', width: 375, height: 667 },
//         { name: 'tablet', width: 768, height: 1024 },
//         { name: 'desktop', width: 1366, height: 768 }
//     ];
    
//     const results = {};
    
//     for (const viewport of viewports) {
//         await page.setViewport({ width: viewport.width, height: viewport.height });
//         await page.reload({ waitUntil: 'networkidle2' });
        
//         // Check for horizontal scrollbar
//         const hasHorizontalScroll = await page.evaluate(() => {
//             return document.documentElement.scrollWidth > document.documentElement.clientWidth;
//         });
        
//         // Check for viewport meta tag
//         const hasViewportMeta = await page.evaluate(() => {
//             const viewport = document.querySelector('meta[name="viewport"]');
//             return !!viewport;
//         });
        
//         // Check for media queries in CSS
//         const hasMediaQueries = await page.evaluate(() => {
//             const stylesheets = Array.from(document.styleSheets);
//             for (const stylesheet of stylesheets) {
//                 try {
//                     const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
//                     for (const rule of rules) {
//                         if (rule.type === CSSRule.MEDIA_RULE) {
//                             return true;
//                         }
//                     }
//                 } catch (e) {
//                     // CORS or other access issues
//                 }
//             }
//             return false;
//         });
        
//         const issues = [];
//         if (hasHorizontalScroll) issues.push('Horizontal scrollbar detected');
//         if (!hasViewportMeta) issues.push('Missing viewport meta tag');
//         if (!hasMediaQueries) issues.push('No CSS media queries detected');
        
//         results[viewport.name] = {
//             compatible: issues.length === 0,
//             issues: issues,
//             hasViewportMeta: hasViewportMeta,
//             hasMediaQueries: hasMediaQueries,
//             hasHorizontalScroll: hasHorizontalScroll
//         };
//     }
    
//     return results;
// }

// // Security analysis function
// async function performSecurityAnalysis(page, htmlContent, url) {
//     const $ = cheerio.load(htmlContent);
    
    
//     // XSS Analysis
//     const xssAnalysis = {
//         detected: false,
//         severity: 'low',
//         locations: [],
//         indicators: []
//     };
    
//     // Check for potentially dangerous inline scripts
//     const inlineScripts = $('script:not([src])');
//     if (inlineScripts.length > 0) {
//         xssAnalysis.detected = true;
//         xssAnalysis.severity = 'medium';
//         xssAnalysis.locations.push('inline scripts');
//         xssAnalysis.indicators.push(`${inlineScripts.length} inline script tags`);
//     }
    
//     // Check for eval() usage
//     if (htmlContent.includes('eval(')) {
//         xssAnalysis.detected = true;
//         xssAnalysis.severity = 'high';
//         xssAnalysis.indicators.push('eval() usage detected');
//     }
    
//     // Form analysis for potential injection points
//     const forms = $('form');
//     const inputs = $('input, textarea');
    
//     const sqlInjectionAnalysis = {
//         detected: forms.length > 0,
//         severity: forms.length > 0 ? 'medium' : 'low',
//         locations: forms.length > 0 ? ['forms'] : [],
//         riskFactors: {
//             forms: forms.length,
//             inputs: inputs.length
//         }
//     };
    
//     // Security headers analysis
//     const securityHeaders = await analyzeSecurityHeaders(url);
    
//     return {
//         xss: xssAnalysis,
//         sqlInjection: sqlInjectionAnalysis,
//         commandInjection: {
//             detected: false,
//             severity: 'low',
//             locations: []
//         },
//         insecureHeaders: securityHeaders
//     };
// }

// // Security headers analysis
// async function analyzeSecurityHeaders(url) {
//     try {
//         const response = await axios.head(url, { timeout: 10000 });
//         const headers = response.headers;
        
//         const requiredHeaders = {
//             'content-security-policy': 'Content Security Policy',
//             'x-frame-options': 'X-Frame-Options',
//             'x-content-type-options': 'X-Content-Type-Options',
//             'strict-transport-security': 'Strict Transport Security',
//             'referrer-policy': 'Referrer Policy'
//         };
        
//         const missing = [];
//         const present = [];
        
//         Object.entries(requiredHeaders).forEach(([header, name]) => {
//             if (headers[header]) {
//                 present.push(name);
//             } else {
//                 missing.push(name);
//             }
//         });
        
//         return {
//             detected: missing.length > 0,
//             severity: missing.length > 3 ? 'high' : missing.length > 1 ? 'medium' : 'low',
//             missing: missing,
//             present: present
//         };
//     } catch (error) {
//         return {
//             detected: true,
//             severity: 'medium',
//             error: 'Could not analyze headers',
//             missing: ['Unable to fetch headers']
//         };
//     }
// }

// // SEO analysis function
// async function performSEOAnalysis(htmlContent, page) {
//     const $ = cheerio.load(htmlContent);
    
//     // Title analysis
//     const title = $('title').text().trim();
//     const titleAnalysis = {
//         present: title.length > 0,
//         content: title,
//         length: title.length,
//         optimal: title.length >= 30 && title.length <= 60
//     };
    
//     // Meta description analysis
//     const metaDesc = $('meta[name="description"]').attr('content') || '';
//     const metaDescAnalysis = {
//         present: metaDesc.length > 0,
//         content: metaDesc,
//         length: metaDesc.length,
//         optimal: metaDesc.length >= 120 && metaDesc.length <= 160
//     };
    
//     // Heading analysis
//     const h1Count = $('h1').length;
//     const h2Count = $('h2').length;
//     const h3Count = $('h3').length;
    
//     const headingAnalysis = {
//         h1Count: h1Count,
//         h2Count: h2Count,
//         h3Count: h3Count,
//         structure: h1Count === 1 ? 'good' : h1Count === 0 ? 'poor' : 'needs improvement'
//     };
    
//     // Image analysis
//     const images = $('img');
//     let imagesWithoutAlt = 0;
//     images.each((i, img) => {
//         const alt = $(img).attr('alt');
//         if (!alt || alt.trim() === '') {
//             imagesWithoutAlt++;
//         }
//     });
    
//     const imageAnalysis = {
//         total: images.length,
//         withoutAlt: imagesWithoutAlt,
//         altCoverage: images.length > 0 ? ((images.length - imagesWithoutAlt) / images.length * 100) : 100
//     };
    
//     // Additional factors
//     const additionalFactors = {
//         hasMetaViewport: $('meta[name="viewport"]').length > 0,
//         hasCanonical: $('link[rel="canonical"]').length > 0,
//         hasOpenGraph: $('meta[property^="og:"]').length > 0,
//         hasStructuredData: $('script[type="application/ld+json"]').length > 0 || htmlContent.includes('schema.org'),
//         hasRobotsMeta: $('meta[name="robots"]').length > 0
//     };
    
//     return {
//         titleTag: titleAnalysis,
//         metaDescription: metaDescAnalysis,
//         headings: headingAnalysis,
//         images: imageAnalysis,
//         additionalFactors: additionalFactors
//     };
// }

// // Lighthouse analysis function
// async function runLighthouseAnalysis(url) {
//         console.log('🟢 [Lighthouse] Launching Chrome...');

//     try {
//         const chrome = await chromeLauncher.launch({
//             chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
//         });
//                 console.log('🟢 [Lighthouse] Chrome launched. Running Lighthouse...');

        
//         const options = {
//             logLevel: 'error',
//             output: 'json',
//             onlyCategories: ['performance', 'seo', 'best-practices', 'accessibility'],
//             port: chrome.port
//         };
        
//         const runnerResult = await lighthouse(url, options);
//                 console.log('🟢 [Lighthouse] Analysis complete. Killing Chrome...');

//         await chrome.kill();
        
//         const lhr = runnerResult.lhr;
//                 console.log('🟢 [Lighthouse] Results processed.');

//         return {
//             performance: {
//                 score: Math.round(lhr.categories.performance.score * 100),
//                 metrics: {
//                     firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
//                     largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
//                     firstInputDelay: lhr.audits['max-potential-fid'].numericValue,
//                     cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
//                     speedIndex: lhr.audits['speed-index'].numericValue
//                 }
//             },
//             seo: {
//                 score: Math.round(lhr.categories.seo.score * 100)
//             },
//             bestPractices: {
//                 score: Math.round(lhr.categories['best-practices'].score * 100)
//             },
//             accessibility: {
//                 score: Math.round(lhr.categories.accessibility.score * 100)
//             }
//         };
//     } catch (error) {
//         console.error('Lighthouse analysis failed:', error);
//         return {
//             performance: { score: 0, error: 'Analysis failed' },
//             seo: { score: 0, error: 'Analysis failed' },
//             bestPractices: { score: 0, error: 'Analysis failed' },
//             accessibility: { score: 0, error: 'Analysis failed' }
//         };
//     }
// }

// // Calculate overall score
// function calculateOverallScore(performance, responsiveness, security, seo, lighthouse) {
//     let score = 100;
    
//     // Performance penalties
//     if (performance.loadTime > 3) score -= 20;
//     else if (performance.loadTime > 2) score -= 10;
    
//     // Lighthouse performance
//     if (lighthouse.performance.score < 50) score -= 20;
//     else if (lighthouse.performance.score < 75) score -= 10;
    
//     // Responsiveness penalties
//     const responsiveIssues = Object.values(responsiveness).reduce((acc, curr) => acc + curr.issues.length, 0);
//     score -= responsiveIssues * 5;
    
//     // Security penalties
//     Object.values(security).forEach(vuln => {
//         if (vuln.detected) {
//             if (vuln.severity === 'high') score -= 20;
//             else if (vuln.severity === 'medium') score -= 10;
//             else score -= 5;
//         }
//     });
    
//     // SEO penalties
//     if (!seo.titleTag.present) score -= 10;
//     if (!seo.metaDescription.present) score -= 5;
//     if (seo.images.withoutAlt > 0) score -= 5;
    
//     return Math.max(0, Math.min(100, score));
// }

// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//     console.log(` Backend running on port ${port}`);
//     console.log(` Health check: http://localhost:${port}/health`);
//     console.log(` Analysis endpoint: http://localhost:${port}/api/analyze`);
// });


// const express = require('express');
// const puppeteer = require('puppeteer');
// const lighthouse = require('lighthouse').default;
// const chromeLauncher = require('chrome-launcher');

// const cors = require('cors');
// const app = express();
// app.use(cors());

// app.use(express.json());

// // Utility: Launch Chrome for Lighthouse
// async function launchChromeAndRunLighthouse(url, opts = {}, config = null) {
//   const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
//   opts.port = chrome.port;
//   const result = await lighthouse(url, opts, config);
//   await chrome.kill();
//   return result.lhr;
// }

// // Utility: Compress Screenshot
// async function captureScreenshot(page) {
//   const screenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
//   return screenshot;
// }

// // Utility: Analyze Performance
// async function analyzePerformance(page) {
//   const perfEntries = await page.evaluate(() => JSON.stringify(window.performance.timing));
//   const perfData = JSON.parse(perfEntries);
//   const loadTime = perfData.loadEventEnd - perfData.navigationStart;
//   return { loadTime };
// }

// // Utility: Test Responsiveness
// async function testResponsiveness(page) {
//   const result = await page.evaluate(() => {
//     return {
//       isResponsive: window.matchMedia("only screen and (max-width: 760px)").matches,
//       windowWidth: window.innerWidth,
//       stylesComputed: getComputedStyle(document.body).width
//     };
//   });
//   return result;
// }

// // Utility: Test Security Vulnerabilities (basic regex logic)
// async function testSecurityVulnerabilities(url, html) {
//   const xssRegex = /<script.*?>.*?<\/script>/gi;
//   const sqlRegex = /SELECT .* FROM|INSERT INTO|UPDATE .* SET|DELETE FROM/gi;
//   return {
//     xssFound: xssRegex.test(html),
//     sqlInjectionFound: sqlRegex.test(html)
//   };
// }

// // Utility: SEO Analysis
// async function testSEOFactors(page) {
//   const result = await page.evaluate(() => {
//     const title = document.querySelector('title')?.innerText || null;
//     const metaDescription = document.querySelector('meta[name="description"]')?.content || null;
//     const h1 = document.querySelectorAll('h1').length;
//     const h2 = document.querySelectorAll('h2').length;
//     const images = [...document.querySelectorAll('img')];
//     const missingAlt = images.filter(img => !img.alt).length;

//     return {
//       title,
//       metaDescription,
//       headings: { h1, h2 },
//       totalImages: images.length,
//       missingAlt
//     };
//   });
//   return result;
// }
// // app.post('/api/fetch-html', async (req, res) => {
// //  const { url } = req.body;
// //    if (!url) return res.status(400).json({ error: 'Missing URL' });

// //    try {
// //      const response = await fetch(url);
// //      if (!response.ok) {
// //        return res.status(response.status).json({ error: `Failed to fetch URL: ${response.statusText}` });
// //      }

// //      const html = await response.text();
// //      res.json({ html });
// //      console.log("html",html)
// //    } catch (error) {
// //      console.error('Error fetching HTML:', error);
// //      res.status(500).json({ error: error.message });
// //    }
// //  });


// // Endpoint: /api/analyze

// app.post('/api/fetch-html', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Missing URL' });

//   let browser;
//   try {
//     browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Use real User-Agent to bypass bot blocks
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36');

//     await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

//     const html = await page.content();

//     res.json({ html });
//   } catch (error) {
//     console.error('Error fetching HTML via Puppeteer:', error);
//     res.status(500).json({ error: error.message });
//   } finally {
//     if (browser) await browser.close();
//   }
// });



// app.post('/api/analyze', async (req, res) => {
//   const { url } = req.body;
//   let browser;
//   try {
//     browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//     const html = await page.content();

//     // const [performance, responsiveness, security, seo, screenshot, lighthouseReport] = await Promise.all([
//     //   analyzePerformance(page),
//     //   testResponsiveness(page),
//     //   testSecurityVulnerabilities(url, html),
//     //   testSEOFactors(page),
//     //   captureScreenshot(page),
//     //   launchChromeAndRunLighthouse(url)
//     // ]);
// const [performance, responsiveness, security, seo, screenshot, lighthouseReport] = await Promise.all([
//   analyzePerformance(page),
//   testResponsiveness(page),
//   testSecurityVulnerabilities(url, html),
//   testSEOFactors(page),
//   captureScreenshot(page),
//   launchChromeAndRunLighthouse(url)
// ]);

// // Calculate page size in KB
// const pageSizeKB = Math.round(html.length / 1024);

// // Extract HTTPS status and other audit values
// const lighthouseAudits = lighthouseReport.audits || {};
// const isOnHttps = lighthouseAudits['is-on-https']?.score === 1;
// const requestCount = lighthouseAudits['network-requests']?.details?.items?.length || 0;

// // Add to performance object
// performance.size = pageSizeKB;
// performance.requests = requestCount;
// performance.isOnHttps = isOnHttps;
// res.json({
//   success: true,
//   performance,
//   responsiveness,
//   security,
//   seo,
//   screenshot,
//   lighthouse: {
//     score: lighthouseReport.categories.performance.score,
//     audits: lighthouseAudits
//   }
// });

//     // res.json({
//     //   success: true,
//     //   performance,
//     //   responsiveness,
//     //   security,
//     //   seo,
//     //   screenshot,
//     //   lighthouse: {
//     //     score: lighthouseReport.categories.performance.score,
//     //     audits: lighthouseReport.audits
//     //   }
//     // });
//   } catch (err) {
//     console.error('Analysis failed:', err);
//     res.status(500).json({ error: 'Analysis failed', detail: err.message });
//   } finally {
//     if (browser) await browser.close();
//   }
// });

// app.listen(3001, () => console.log('✅ Backend running on http://localhost:3001'));

// ye wala sb thk hia all right 
// const express = require('express');
// const puppeteer = require('puppeteer');
// const lighthouse = require('lighthouse').default;
// const chromeLauncher = require('chrome-launcher');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Launch Chrome for Lighthouse
// async function launchChromeAndRunLighthouse(url, opts = {}, config = null) {
//   const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
//   opts.port = chrome.port;
//   const result = await lighthouse(url, opts, config);
//   await chrome.kill();
//   return result.lhr;
// }

// // Screenshot Capture
// async function captureScreenshot(page) {
//   const screenshot = await page.screenshot({ encoding: 'base64', fullPage: true });
//   return screenshot;
// }

// // Performance
// async function analyzePerformance(page) {
//   const perfEntries = await page.evaluate(() => JSON.stringify(window.performance.timing));
//   const perfData = JSON.parse(perfEntries);
//   const loadTime = perfData.loadEventEnd - perfData.navigationStart;
//   return { loadTime };
// }

// // Responsiveness
// async function testResponsiveness(page) {
//   const result = await page.evaluate(() => {
//     return {
//       isResponsive: window.matchMedia("only screen and (max-width: 760px)").matches,
//       windowWidth: window.innerWidth,
//       stylesComputed: getComputedStyle(document.body).width
//     };
//   });
//   return result;
// }

// // Security (basic pattern checks)
// async function testSecurityVulnerabilities(url, html) {
//   const xssRegex = /<script.*?>.*?<\/script>/gi;
//   const sqlRegex = /SELECT .* FROM|INSERT INTO|UPDATE .* SET|DELETE FROM/gi;
//   return {
//     xssFound: xssRegex.test(html),
//     sqlInjectionFound: sqlRegex.test(html)
//   };
// }

// // SEO
// async function testSEOFactors(page) {
//   const result = await page.evaluate(() => {
//     const title = document.querySelector('title')?.innerText || null;
//     const metaDescription = document.querySelector('meta[name="description"]')?.content || null;
//     const h1 = document.querySelectorAll('h1').length;
//     const h2 = document.querySelectorAll('h2').length;
//     const images = [...document.querySelectorAll('img')];
//     const missingAlt = images.filter(img => !img.alt).length;

//     return {
//       title,
//       metaDescription,
//       headings: { h1, h2 },
//       totalImages: images.length,
//       missingAlt
//     };
//   });
//   return result;
// }

// // ✅ New: Media Query Detection
// async function extractMediaQueries(page) {
//   const queries = await page.evaluate(() => {
//     const stylesheets = Array.from(document.styleSheets);
//     const results = [];

//     stylesheets.forEach(sheet => {
//       try {
//         for (const rule of sheet.cssRules) {
//           if (rule.type === CSSRule.MEDIA_RULE) {
//             results.push(rule.conditionText);
//           }
//         }
//       } catch (err) {
//         // Ignore cross-origin stylesheets
//       }
//     });

//     return results;
//   });

//   return queries;
// }

// // Fetch HTML via Puppeteer
// app.post('/api/fetch-html', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Missing URL' });

//   let browser;
//   try {
//     browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36');

//     await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

//     const html = await page.content();
//     res.json({ html });
//   } catch (error) {
//     console.error('Error fetching HTML via Puppeteer:', error);
//     res.status(500).json({ error: error.message });
//   } finally {
//     if (browser) await browser.close();
//   }
// });

// // Main Analysis Endpoint
// app.post('/api/analyze', async (req, res) => {
//   const { url } = req.body;
//   let browser;

//   try {
//     browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();
//     await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

//     const html = await page.content();

//     const [
//       performance,
//       responsiveness,
//       security,
//       seo,
//       screenshot,
//       lighthouseReport,
//       mediaQueries
//     ] = await Promise.all([
//       analyzePerformance(page),
//       testResponsiveness(page),
//       testSecurityVulnerabilities(url, html),
//       testSEOFactors(page),
//       captureScreenshot(page),
//       launchChromeAndRunLighthouse(url),
//       extractMediaQueries(page)
//     ]);

//     const pageSizeKB = Math.round(html.length / 1024);
//     const lighthouseAudits = lighthouseReport.audits || {};
//     const isOnHttps = lighthouseAudits['is-on-https']?.score === 1;
//     const requestCount = lighthouseAudits['network-requests']?.details?.items?.length || 0;

//     performance.size = pageSizeKB;
//     performance.requests = requestCount;
//     performance.isOnHttps = isOnHttps;

//     res.json({
//       success: true,
//       performance,
//       responsiveness,
//       security,
//       seo,
//       mediaQueries,
//       screenshot,
//       lighthouse: {
//         score: lighthouseReport.categories.performance.score,
//         audits: lighthouseAudits
//       }
//     });
//   } catch (err) {
//     console.error('Analysis failed:', err);
//     res.status(500).json({ error: 'Analysis failed', detail: err.message });
//   } finally {
//     if (browser) await browser.close();
//   }
// });

// // Start Server
// app.listen(3001, () => console.log('✅ Backend running on http://localhost:3001'));


// const express = require('express');
// const puppeteer = require('puppeteer');
// // const chromeLauncher = require('chrome-launcher');
// const chromeLauncher = (await import('chrome-launcher')).default;

// // const {lighthouse} = require('lighthouse');
//  const lighthouse = require('lighthouse').default;

// const cors = require('cors');
// const sharp = require('sharp');
// const axios = require('axios');
// const { URL } = require('url');

// deep first verdion
// import express from 'express';
// import puppeteer from 'puppeteer';
// import * as chromeLauncher from 'chrome-launcher';
// import lighthouse from 'lighthouse';
// import cors from 'cors';
// import sharp from 'sharp';
// import axios from 'axios';
// import { URL } from 'url';

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.get("/", (req, res) => {
//   res.send("Welcome to the APII!");
// });
// // Browser instance management
// let browserInstance = null;

// const getBrowser = async () => {
//   if (!browserInstance) {
//     browserInstance = await puppeteer.launch({
//       headless: 'new',
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-gpu',
//         '--no-first-run',
//         '--no-zygote',
//         '--single-process'
//       ],
//       timeout: 60000
//     });
//   }
//   return browserInstance;
// };

// const releaseBrowser = async () => {
//   if (browserInstance) {
//     await browserInstance.close();
//     browserInstance = null;
//   }
// };

// // HTML fetching endpoint
// app.post('/api/fetch-html', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Missing URL' });

//   let browser;
//   try {
//     browser = await getBrowser();
//     const page = await browser.newPage();
//     await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
//     await page.goto(url, { 
//       waitUntil: 'domcontentloaded', 
//       timeout: 60000 
//     });
    
//     const html = await page.content();
//     res.json({ html });
//   } catch (error) {
//     console.error('Error fetching HTML:', error);
//     res.status(500).json({ error: error.message });
//   } finally {
//     if (browser) await browser.close();
//   }
// });

// // Main analysis endpoint
// app.post('/api/analyze', async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'URL is required' });

//   let page;
//   try {
//     // Validate URL
//     new URL(url);
    
//     // Get browser instance
//     const browser = await getBrowser();
//     page = await browser.newPage();
    
//     // Configure page
//     await page.setDefaultNavigationTimeout(60000);
//     await page.setViewport({ width: 1366, height: 768 });
    
//     // Navigate to page
//     const startTime = Date.now();
//     await page.goto(url, { 
//       waitUntil: 'networkidle2', 
//       timeout: 60000 
//     });
//     const loadTime = (Date.now() - startTime) / 1000;
    
//     // Get rendered HTML
//     const htmlContent = await page.content();
    
//     // Take and compress screenshot
//     const screenshotBuffer = await page.screenshot({ 
//       fullPage: true, 
//       type: 'jpeg', 
//       quality: 80 
//     });
//     const compressedScreenshot = await sharp(screenshotBuffer)
//       .resize(1200)
//       .jpeg({ quality: 70 })
//       .toBuffer();
    
//     // Run Lighthouse analysis
//     const lighthouseResults = await runLighthouseAnalysis(url);
    
//     // Test responsiveness
//     const responsiveness = await testResponsiveness(page);
    
//     // Perform security analysis
//     const securityResults = await performSecurityAnalysis(page, url);
    
//     // Perform SEO analysis
//     const seoResults = await performSEOAnalysis(page);
    
//     // Calculate overall score
//     const overallScore = calculateOverallScore(
//       loadTime,
//       responsiveness,
//       securityResults,
//       seoResults,
//       lighthouseResults.performance
//     );
    
//     res.json({
//       success: true,
//       url,
//       timestamp: new Date().toISOString(),
//       screenshot: `data:image/jpeg;base64,${compressedScreenshot.toString('base64')}`,
//       performance: {
//         loadTime,
//         size: Math.round(htmlContent.length / 1024),
//         requests: lighthouseResults.requests,
//         lighthouseScore: lighthouseResults.performance
//       },
//       responsiveness,
//       security: securityResults,
//       seo: seoResults,
//       overallScore
//     });

//   } catch (error) {
//     console.error('Analysis error:', error);
//     res.status(500).json({ 
//       success: false,
//       error: 'Analysis failed', 
//       message: error.message
//     });
//   } finally {
//     if (page) await page.close();
//   }
// });

// // Run Lighthouse analysis
// async function runLighthouseAnalysis(url) {
//   let chrome;
//   try {
//     chrome = await chromeLauncher.launch({ 
//       chromeFlags: ['--headless', '--no-sandbox'] 
//     });
    
//     const options = {
//       logLevel: 'info',
//       output: 'json',
//       onlyCategories: ['performance'],
//       port: chrome.port
//     };
    
//     // Run Lighthouse
//     const runnerResult = await lighthouse(url, options);
//     const lhr = runnerResult.lhr;
    
//     return {
//       performance: Math.round(lhr.categories.performance.score * 100),
//       requests: lhr.audits['network-requests']?.details?.items?.length || 0
//     };
//   } catch (error) {
//     console.error('Lighthouse analysis failed:', error);
//     return {
//       performance: 0,
//       requests: 0
//     };
//   } finally {
//     if (chrome) await chrome.kill();
//   }
// }

// // Responsiveness testing
// async function testResponsiveness(page) {
//   const viewports = [
//     { name: 'mobile', width: 375, height: 667 },
//     { name: 'tablet', width: 768, height: 1024 },
//     { name: 'desktop', width: 1366, height: 768 }
//   ];
  
//   const results = {};
  
//   for (const viewport of viewports) {
//     try {
//       await page.setViewport({ width: viewport.width, height: viewport.height });
//       await page.evaluate(() => window.dispatchEvent(new Event('resize')));
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const hasHorizontalScroll = await page.evaluate(() => {
//         return document.documentElement.scrollWidth > document.documentElement.clientWidth;
//       });
      
//       const mediaQueries = await page.evaluate(() => {
//         const queries = [];
//         for (const sheet of document.styleSheets) {
//           try {
//             for (const rule of sheet.cssRules) {
//               if (rule.media) {
//                 queries.push(rule.media.mediaText);
//               }
//             }
//           } catch (e) {}
//         }
//         return queries;
//       });
      
//       results[viewport.name] = {
//         compatible: !hasHorizontalScroll,
//         issues: hasHorizontalScroll ? ['Horizontal scroll detected'] : [],
//         mediaQueries: mediaQueries.length
//       };
//     } catch (error) {
//       results[viewport.name] = {
//         compatible: false,
//         error: error.message
//       };
//     }
//   }
  
//   return results;
// }

// // Security analysis
// async function performSecurityAnalysis(page, url) {
//   try {
//     // Test XSS vulnerabilities
//     const xssResults = await testXSSVulnerabilities(page, url);
    
//     // Test SQL injection vulnerabilities
//     const sqlResults = await testSQLInjection(page, url);
    
//     // Check security headers
//     const headers = await checkSecurityHeaders(url);
    
//     return {
//       xss: xssResults,
//       sqlInjection: sqlResults,
//       headers: headers
//     };
//   } catch (error) {
//     console.error('Security analysis failed:', error);
//     return {
//       xss: { detected: false, tests: [] },
//       sqlInjection: { detected: false, tests: [] },
//       headers: { detected: false, missing: [] },
//       error: 'Security tests failed'
//     };
//   }
// }

// async function testXSSVulnerabilities(page, url) {
//   const payloads = [
//     '<script>alert("XSS")</script>',
//     '<img src=x onerror=alert("XSS")>',
//     '" onmouseover=alert("XSS")'
//   ];
  
//   const tests = [];
//   let detected = false;
  
//   for (const payload of payloads) {
//     try {
//       await page.goto(`${url}?test=${encodeURIComponent(payload)}`, {
//         waitUntil: 'domcontentloaded',
//         timeout: 15000
//       });
      
//       const isVulnerable = await page.evaluate((p) => {
//         return document.body.innerHTML.includes(p);
//       }, payload);
      
//       tests.push({
//         payload,
//         vulnerable: isVulnerable,
//         severity: isVulnerable ? 'high' : 'low'
//       });
      
//       if (isVulnerable) detected = true;
//     } catch (error) {
//       tests.push({
//         payload,
//         error: error.message
//       });
//     }
//   }
  
//   return {
//     detected,
//     tests
//   };
// }

// async function testSQLInjection(page, url) {
//   const payloads = [
//     "' OR '1'='1",
//     "' UNION SELECT null,version()--",
//     "'; DROP TABLE users--"
//   ];
  
//   const tests = [];
//   let detected = false;
  
//   for (const payload of payloads) {
//     try {
//       await page.goto(`${url}?search=${encodeURIComponent(payload)}`, {
//         waitUntil: 'domcontentloaded',
//         timeout: 15000
//       });
      
//       const isVulnerable = await page.evaluate(() => {
//         return document.body.innerHTML.includes('SQL syntax') ||
//                document.body.innerHTML.includes('database error');
//       });
      
//       tests.push({
//         payload,
//         vulnerable: isVulnerable,
//         severity: isVulnerable ? 'critical' : 'low'
//       });
      
//       if (isVulnerable) detected = true;
//     } catch (error) {
//       tests.push({
//         payload,
//         error: error.message
//       });
//     }
//   }
  
//   return {
//     detected,
//     tests
//   };
// }

// async function checkSecurityHeaders(url) {
//   try {
//     const response = await axios.head(url, { timeout: 5000 });
//     const headers = response.headers;
    
//     const requiredHeaders = {
//       'Content-Security-Policy': 'Content Security Policy',
//       'X-Frame-Options': 'Clickjacking Protection',
//       'X-Content-Type-Options': 'MIME Sniffing Protection',
//       'Strict-Transport-Security': 'HSTS'
//     };
    
//     const missing = [];
//     const present = [];
    
//     for (const [header, name] of Object.entries(requiredHeaders)) {
//       const headerKey = header.toLowerCase();
//       if (headers[headerKey]) {
//         present.push(name);
//       } else {
//         missing.push(name);
//       }
//     }
    
//     return {
//       detected: missing.length > 0,
//       severity: missing.length > 2 ? 'high' : missing.length > 1 ? 'medium' : 'low',
//       missing,
//       present
//     };
//   } catch (error) {
//     return {
//       detected: true,
//       error: 'Could not analyze headers',
//       missing: ['Unable to fetch headers']
//     };
//   }
// }

// // SEO analysis
// async function performSEOAnalysis(page) {
//   try {
//     const result = await page.evaluate(() => {
//       // Extract title
//       const title = document.title;
      
//       // Extract meta description
//       const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
      
//       // Count headings
//       const h1Count = document.querySelectorAll('h1').length;
//       const h2Count = document.querySelectorAll('h2').length;
      
//       // Analyze images
//       const images = document.querySelectorAll('img');
//       let imagesWithoutAlt = 0;
      
//       images.forEach(img => {
//         if (!img.alt || img.alt.trim() === '') {
//           imagesWithoutAlt++;
//         }
//       });
      
//       // Check structured data
//       const structuredData = document.querySelectorAll('script[type="application/ld+json"]').length;
      
//       return {
//         title,
//         titleLength: title.length,
//         metaDescription,
//         descriptionLength: metaDescription.length,
//         headings: {
//           h1Count,
//           h2Count,
//           structure: h1Count === 1 ? 'good' : h1Count === 0 ? 'poor' : 'needs improvement'
//         },
//         images: {
//           total: images.length,
//           withoutAlt: imagesWithoutAlt,
//           altCoverage: images.length > 0 ? 
//             ((images.length - imagesWithoutAlt) / images.length * 100) : 100
//         },
//         structuredData
//       };
//     });
    
//     return result;
//   } catch (error) {
//     console.error('SEO analysis failed:', error);
//     return {
//       title: '',
//       titleLength: 0,
//       metaDescription: '',
//       descriptionLength: 0,
//       headings: {
//         h1Count: 0,
//         h2Count: 0,
//         structure: 'unknown'
//       },
//       images: {
//         total: 0,
//         withoutAlt: 0,
//         altCoverage: 0
//       },
//       structuredData: 0,
//       error: 'SEO analysis failed'
//     };
//   }
// }

// // Calculate overall score
// function calculateOverallScore(loadTime, responsiveness, security, seo, lighthouseScore) {
//   let score = 100;
  
//   // Performance deductions
//   if (loadTime > 3) score -= 20;
//   else if (loadTime > 2) score -= 10;
  
//   // Lighthouse score impact
//   score = score * 0.7 + (lighthouseScore || 0) * 0.3;
  
//   // Responsiveness deductions
//   for (const viewport in responsiveness) {
//     if (!responsiveness[viewport].compatible) {
//       score -= 5;
//     }
//   }
  
//   // Security deductions
//   if (security.xss?.detected) score -= 15;
//   if (security.sqlInjection?.detected) score -= 20;
//   if (security.headers?.detected) {
//     if (security.headers.severity === 'high') score -= 15;
//     else if (security.headers.severity === 'medium') score -= 10;
//     else if (security.headers.severity === 'low') score -= 5;
//   }
  
//   // SEO deductions
//   if (!seo.title || seo.titleLength === 0) score -= 10;
//   if (seo.images?.withoutAlt > 0) score -= Math.min(5, seo.images.withoutAlt);
//   if (seo.structuredData === 0) score -= 5;
  
//   return Math.max(0, Math.min(100, Math.round(score)));
// }

// // Start server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`✅ Backend running on port ${PORT}`);
//   console.log(`🔍 Health check: http://localhost:${PORT}/health`);
// });

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await releaseBrowser();
//   process.exit(0);
// });




import express from 'express';
import puppeteer from 'puppeteer';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import cors from 'cors';
import sharp from 'sharp';
import axios from 'axios';
import { URL } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the APII!");
});

// Browser instance management
let browserInstance = null;

const getBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ],
      timeout: 60000
    });
  }
  return browserInstance;
};

const releaseBrowser = async () => {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
};

// HTML fetching endpoint
app.post('/api/fetch-html', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });
    
    const html = await page.content();
    res.json({ html });
  } catch (error) {
    console.error('Error fetching HTML:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  const { url, debug = false } = req.body;  // Added debug flag
  if (!url) return res.status(400).json({ error: 'URL is required' });

  let page;
  try {
    // Validate URL
    new URL(url);
    
    // Get browser instance
    const browser = await getBrowser();
    page = await browser.newPage();
    
    // Configure page
    await page.setDefaultNavigationTimeout(60000);
    await page.setViewport({ width: 1366, height: 768 });
    
    // Navigate to page with extra wait for JS-rendered content
    const startTime = Date.now();
    await page.goto(url, { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });
    // await page.waitForTimeout(3000);  // Additional wait for JS execution
    const loadTime = (Date.now() - startTime) / 1000;
    
    // Get rendered HTML
    const htmlContent = await page.content();
    
    // DEBUG: Log meta tags if requested
    let debugMeta = null;
    if (debug) {
      debugMeta = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('meta')).map(tag => ({
          name: tag.name || tag.getAttribute('property') || 'N/A',
          content: tag.content || 'N/A'
        }));
      });
    }
    
    // Take and compress screenshot
    const screenshotBuffer = await page.screenshot({ 
      fullPage: true, 
      type: 'jpeg', 
      quality: 80 
    });
    const compressedScreenshot = await sharp(screenshotBuffer)
      .resize(1200)
      .jpeg({ quality: 70 })
      .toBuffer();
    
    // Run Lighthouse analysis
    const lighthouseResults = await runLighthouseAnalysis(url);
    
    // Test responsiveness
    const responsiveness = await testResponsiveness(page);
    
    // Perform security analysis
    const securityResults = await performSecurityAnalysis(page, url);
    
    // Perform SEO analysis
    const seoResults = await performSEOAnalysis(page);
    
    // Calculate overall score
    const overallScore = calculateOverallScore(
      loadTime,
      responsiveness,
      securityResults,
      seoResults,
      lighthouseResults.performance
    );
    
    res.json({
      success: true,
      url,
      timestamp: new Date().toISOString(),
      screenshot: `data:image/jpeg;base64,${compressedScreenshot.toString('base64')}`,
      performance: {
        loadTime,
        size: Math.round(htmlContent.length / 1024),
        requests: lighthouseResults.requests,
        lighthouseScore: lighthouseResults.performance
      },
      responsiveness,
      security: securityResults,
      seo: seoResults,
      overallScore,
      debug: debug ? { metaTags: debugMeta } : undefined  // Include debug data
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Analysis failed', 
      message: error.message
    });
  } finally {
    if (page) await page.close();
  }
});

// Run Lighthouse analysis
async function runLighthouseAnalysis(url) {
  let chrome;
  try {
    chrome = await chromeLauncher.launch({ 
      chromeFlags: ['--headless', '--no-sandbox'] 
    });
    
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance'],
      port: chrome.port
    };
    
    // Run Lighthouse
    const runnerResult = await lighthouse(url, options);
    const lhr = runnerResult.lhr;
    
    return {
      performance: Math.round(lhr.categories.performance.score * 100),
      requests: lhr.audits['network-requests']?.details?.items?.length || 0
    };
  } catch (error) {
    console.error('Lighthouse analysis failed:', error);
    return {
      performance: 0,
      requests: 0
    };
  } finally {
    if (chrome) await chrome.kill();
  }
}

// Responsiveness testing
async function testResponsiveness(page) {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1366, height: 768 }
  ];
  
  const results = {};
  
  for (const viewport of viewports) {
    try {
      await page.setViewport({ width: viewport.width, height: viewport.height });
      await page.evaluate(() => window.dispatchEvent(new Event('resize')));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      const mediaQueries = await page.evaluate(() => {
        const queries = [];
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              if (rule.media) {
                queries.push(rule.media.mediaText);
              }
            }
          } catch (e) {}
        }
        return queries;
      });
      
      results[viewport.name] = {
        compatible: !hasHorizontalScroll,
        issues: hasHorizontalScroll ? ['Horizontal scroll detected'] : [],
        mediaQueries: mediaQueries.length
      };
    } catch (error) {
      results[viewport.name] = {
        compatible: false,
        error: error.message
      };
    }
  }
  
  return results;
}

// Security analysis
async function performSecurityAnalysis(page, url) {
  try {
    // Test XSS vulnerabilities
    const xssResults = await testXSSVulnerabilities(page, url);
    
    // Test SQL injection vulnerabilities
    const sqlResults = await testSQLInjection(page, url);
    
    // Check security headers
    const headers = await checkSecurityHeaders(url);
    
    return {
      xss: xssResults,
      sqlInjection: sqlResults,
      headers: headers
    };
  } catch (error) {
    console.error('Security analysis failed:', error);
    return {
      xss: { detected: false, tests: [] },
      sqlInjection: { detected: false, tests: [] },
      headers: { detected: false, missing: [] },
      error: 'Security tests failed'
    };
  }
}

async function testXSSVulnerabilities(page, url) {
  const payloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert("XSS")>',
    '" onmouseover=alert("XSS")'
  ];
  
  const tests = [];
  let detected = false;
  
  for (const payload of payloads) {
    try {
      await page.goto(`${url}?test=${encodeURIComponent(payload)}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });
      
      const isVulnerable = await page.evaluate((p) => {
        return document.body.innerHTML.includes(p);
      }, payload);
      
      tests.push({
        payload,
        vulnerable: isVulnerable,
        severity: isVulnerable ? 'high' : 'low'
      });
      
      if (isVulnerable) detected = true;
    } catch (error) {
      tests.push({
        payload,
        error: error.message
      });
    }
  }
  
  return {
    detected,
    tests
  };
}

async function testSQLInjection(page, url) {
  const payloads = [
    "' OR '1'='1",
    "' UNION SELECT null,version()--",
    "'; DROP TABLE users--"
  ];
  
  const tests = [];
  let detected = false;
  
  for (const payload of payloads) {
    try {
      await page.goto(`${url}?search=${encodeURIComponent(payload)}`, {
        waitUntil: 'domcontentloaded',
        timeout: 15000
      });
      
      const isVulnerable = await page.evaluate(() => {
        return document.body.innerHTML.includes('SQL syntax') ||
               document.body.innerHTML.includes('database error');
      });
      
      tests.push({
        payload,
        vulnerable: isVulnerable,
        severity: isVulnerable ? 'critical' : 'low'
      });
      
      if (isVulnerable) detected = true;
    } catch (error) {
      tests.push({
        payload,
        error: error.message
      });
    }
  }
  
  return {
    detected,
    tests
  };
}

async function checkSecurityHeaders(url) {
  try {
    const response = await axios.head(url, { timeout: 5000 });
    const headers = response.headers;
    
    const requiredHeaders = {
      'Content-Security-Policy': 'Content Security Policy',
      'X-Frame-Options': 'Clickjacking Protection',
      'X-Content-Type-Options': 'MIME Sniffing Protection',
      'Strict-Transport-Security': 'HSTS'
    };
    
    const missing = [];
    const present = [];
    
    for (const [header, name] of Object.entries(requiredHeaders)) {
      const headerKey = header.toLowerCase();
      if (headers[headerKey]) {
        present.push(name);
      } else {
        missing.push(name);
      }
    }
    
    return {
      detected: missing.length > 0,
      severity: missing.length > 2 ? 'high' : missing.length > 1 ? 'medium' : 'low',
      missing,
      present
    };
  } catch (error) {
    return {
      detected: true,
      error: 'Could not analyze headers',
      missing: ['Unable to fetch headers']
    };
  }
}

// UPDATED SEO analysis with robust meta description handling
async function performSEOAnalysis(page) {
  try {
    const result = await page.evaluate(() => {
      // Extract title
      const title = document.title;
      
      // IMPROVED META DESCRIPTION EXTRACTION
      const getMetaDescription = () => {
        // Find all meta tags
        const metaTags = Array.from(document.querySelectorAll('meta'));
        
        // Check standard description tag
        const standardDesc = metaTags.find(tag => 
          tag.name && tag.name.toLowerCase() === 'description'
        );
        
        // Check Open Graph description as fallback
        const ogDesc = metaTags.find(tag => 
          tag.getAttribute('property') === 'og:description'
        );
        
        // Return the first valid description found
        return standardDesc?.content || ogDesc?.content || '';
      };
      
      const metaDescription = getMetaDescription();
      
      // Unescape HTML entities in description
      const unescapeHtml = (text) => {
        const parser = new DOMParser();
        return parser.parseFromString(text, 'text/html').documentElement.textContent;
      };
      
      const cleanDescription = metaDescription ? unescapeHtml(metaDescription) : '';
      
      // Count headings
      const h1Count = document.querySelectorAll('h1').length;
      const h2Count = document.querySelectorAll('h2').length;
      
      // Analyze images
      const images = document.querySelectorAll('img');
      let imagesWithoutAlt = 0;
      
      images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
          imagesWithoutAlt++;
        }
      });
      
      // Check structured data
      const structuredData = document.querySelectorAll('script[type="application/ld+json"]').length;
      
      return {
        title,
        titleLength: title.length,
        metaDescription: cleanDescription,
        descriptionLength: cleanDescription.length,
        headings: {
          h1Count,
          h2Count,
          structure: h1Count === 1 ? 'good' : h1Count === 0 ? 'poor' : 'needs improvement'
        },
        images: {
          total: images.length,
          withoutAlt: imagesWithoutAlt,
          altCoverage: images.length > 0 ? 
            ((images.length - imagesWithoutAlt) / images.length * 100) : 100
        },
        structuredData
      };
    });
    
    return result;
  } catch (error) {
    console.error('SEO analysis failed:', error);
    return {
      title: '',
      titleLength: 0,
      metaDescription: '',
      descriptionLength: 0,
      headings: {
        h1Count: 0,
        h2Count: 0,
        structure: 'unknown'
      },
      images: {
        total: 0,
        withoutAlt: 0,
        altCoverage: 0
      },
      structuredData: 0,
      error: 'SEO analysis failed'
    };
  }
}

// Calculate overall score
function calculateOverallScore(loadTime, responsiveness, security, seo, lighthouseScore) {
  let score = 100;
  
  // Performance deductions
  if (loadTime > 3) score -= 20;
  else if (loadTime > 2) score -= 10;
  
  // Lighthouse score impact
  score = score * 0.7 + (lighthouseScore || 0) * 0.3;
  
  // Responsiveness deductions
  for (const viewport in responsiveness) {
    if (!responsiveness[viewport].compatible) {
      score -= 5;
    }
  }
  
  // Security deductions
  if (security.xss?.detected) score -= 15;
  if (security.sqlInjection?.detected) score -= 20;
  if (security.headers?.detected) {
    if (security.headers.severity === 'high') score -= 15;
    else if (security.headers.severity === 'medium') score -= 10;
    else if (security.headers.severity === 'low') score -= 5;
  }
  
  // SEO deductions
  if (!seo.title || seo.titleLength === 0) score -= 10;
  if (seo.descriptionLength === 0) score -= 15;  // Increased penalty for missing description
  if (seo.images?.withoutAlt > 0) score -= Math.min(5, seo.images.withoutAlt);
  if (seo.structuredData === 0) score -= 5;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await releaseBrowser();
  process.exit(0);
});
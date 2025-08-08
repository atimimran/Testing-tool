// import React, { useState } from 'react';
// import './WebsiteTester.css';

// const WebsiteTester = () => {
//   const [url, setUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [results, setResults] = useState(null);
//   const [progress, setProgress] = useState(0);
//   const [currentTest, setCurrentTest] = useState('');
//   const [screenshot, setScreenshot] = useState(null);

//   const securityTests = {
//     xssPayloads: [
//       '<script>alert("XSS")</script>',
//       'javascript:alert("XSS")',
//       '<img src=x onerror=alert("XSS")>',
//       '<svg onload=alert("XSS")>',
//       '" onmouseover="alert("XSS")',
//       '<iframe src="javascript:alert(\"XSS\")"></iframe>'
//     ],
//     sqlPayloads: [
//       "' OR '1'='1",
//       "'; DROP TABLE users; --",
//       "' UNION SELECT * FROM information_schema.tables --",
//       "admin'--",
//       "' OR 1=1#",
//       "1' AND (SELECT COUNT(*) FROM users) > 0 --"
//     ],
//     commandPayloads: [
//       '; ls -la',
//       '| cat /etc/passwd',
//       '$(whoami)',
//       '`id`',
//       '&& dir',
//       '; ping google.com'
//     ]
//   };

//   const validateUrl = (inputUrl) => {
//     try {
//       const urlObj = new URL(inputUrl);
//       return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
//     } catch (_) {
//       return false;
//     }
//   };
// const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// const captureScreenshot = async (testUrl) => {
//     try {
//       await sleep(1000);
      
//       const screenshotServices = [
//         `https://mini.s-shot.ru/1024x768/JPEG/1024/Z100/?${encodeURIComponent(testUrl)}`,
        
//         `https://urltoimage.com/v1/query?url=${encodeURIComponent(testUrl)}&width=1200&height=800`,
        
//         `https://image.thum.io/get/width/1200/crop/800/${encodeURIComponent(testUrl)}`,
        
//         `https://api.screenshotone.com/take?access_key=demo&url=${encodeURIComponent(testUrl)}&viewport_width=1200&viewport_height=800&image_quality=80&format=jpg`
//       ];
      
//       for (let i = 0; i < screenshotServices.length; i++) {
//         try {
//           const screenshotUrl = screenshotServices[i];
          
//           const testImage = new Image();
//           const imageLoadPromise = new Promise((resolve, reject) => {
//             testImage.onload = () => resolve(screenshotUrl);
//             testImage.onerror = () => reject(new Error(`Service ${i + 1} failed`));
//             setTimeout(() => reject(new Error(`Service ${i + 1} timeout`)), 10000);
//           });
          
//           testImage.src = screenshotUrl;
          
//           const workingUrl = await imageLoadPromise;
          
//           return {
//             url: workingUrl,
//             timestamp: new Date().toISOString(),
//             success: true,
//             service: `Service ${i + 1}`
//           };
//         } catch (serviceError) {
//           console.log(`Screenshot service ${i + 1} failed:`, serviceError.message);
//           continue;
//         }
//       }
      
//       throw new Error('All screenshot services failed');
      
//     } catch (error) {
//       console.error('Screenshot capture failed:', error);
//       return {
//         url: null,
//         error: error.message,
//         success: false
//       };
//     }
//   };

// //   const testWebsitePerformance = async (testUrl) => {
// //     try {
// //       console.log(`Analyzing website via backend: ${testUrl}`);
      
// //       const response = await fetch('http://localhost:3001/api/analyze', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json'
// //         },
// //         body: JSON.stringify({ url: testUrl })
// //       });
// // // const result = await response.json();
// // // console.log("Analysis result:", result);      
// //       if (!response.ok) {
// //         throw new Error(`Backend request failed: HTTP ${response.status}`);
// //       }
      
// //       const data = await response.json();
// //       console.log("Analysis result:", data);      

// //       if (!data.success) {
// //         throw new Error(data.message || 'Backend analysis failed');
// //       }
// //       console.log("data.performance.loadTime",data.performance.loadTime)
// //       // Transform backend response to match expected format
// //       return {
// //         loadTime: data.performance.loadTime,
// //         status: 'success',
// //         size: Math.round(data.performance.size / 1024), // Convert bytes to KB
// //         requests: data.performance.nodes || 50, // Use DOM nodes as request estimate
// //         htmlContent: null, // Backend doesn't return HTML content for security
// //         backendData: data, // Store full backend response
// //         screenshot: data.screenshot,
// //         performance: data.performance,
// //         responsiveness: data.responsiveness,
// //         security: data.security,
// //         seo: data.seo,
// //         overallScore: data.overallScore
// //       };
      
// //     } catch (error) {
// //       console.error('Backend analysis failed:', error);
      
// //       // Fallback to simulated data if backend is unavailable
// //       console.warn('Backend unavailable, using simulated data');
      
// //       return {
// //         loadTime: 2.5,
// //         status: 'backend_error',
// //         error: `Backend analysis failed: ${error.message}`,
// //         size: Math.floor(Math.random() * 500) + 100, // 100-600 KB
// //         requests: Math.floor(Math.random() * 50) + 10, // 10-60 requests
// //         htmlContent: generateSimulatedHTML(testUrl) // Generate basic HTML for analysis
// //       };
// //     }
// //   };
  


// async function testWebsitePerformance(url) {
//   console.log("Analyize Url",url)
//   const response = await fetch('http://localhost:3001/api/analyze', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ url })
//   });

//   if (!response.ok) throw new Error("Backend analysis failed");

//   const data = await response.json();
//   if (!data.performance) throw new Error("No performance object in result");

//   return data;
// }
//   const generateSimulatedHTML = (url) => {
//     return `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Simulated Page - ${url}</title>
//         <meta name="description" content="This is a simulated page for testing purposes when CORS proxies fail.">
//       </head>
//       <body>
//         <h1>Welcome to Our Website</h1>
//         <h2>About Us</h2>
//         <p>This is sample content for analysis.</p>
//         <img src="image1.jpg" alt="Sample image">
//         <img src="image2.jpg" alt="Another image">
//         <form>
//           <input type="text" name="search" placeholder="Search...">
//           <input type="submit" value="Submit">
//         </form>
//         <script src="script.js"></script>
//         <link rel="stylesheet" href="styles.css">
//       </body>
//       </html>
//     `;
//   };

//   const testResponsiveness = async (htmlContent) => {
//     try {
//       const results = {};
//       const viewports = ['mobile', 'tablet', 'desktop'];
      
//       const hasViewportMeta = htmlContent.includes('<meta name="viewport"');
//       const hasMediaQueries = htmlContent.includes('@media') || htmlContent.includes('responsive');
//       const hasBootstrap = htmlContent.includes('bootstrap') || htmlContent.includes('responsive');
//       const hasFlexbox = htmlContent.includes('flex') || htmlContent.includes('grid');
      
//       let responsiveScore = 0;
//       if (hasViewportMeta) responsiveScore += 25;
//       if (hasMediaQueries) responsiveScore += 25;
//       if (hasBootstrap) responsiveScore += 25;
//       if (hasFlexbox) responsiveScore += 25;
      
//       viewports.forEach(viewport => {
//         const compatible = responsiveScore >= 50;
//         const issues = [];
        
//         if (!hasViewportMeta) issues.push('Missing viewport meta tag');
//         if (!hasMediaQueries) issues.push('No CSS media queries detected');
//         if (responsiveScore < 25) issues.push('Poor responsive design implementation');
        
//         results[viewport] = {
//           compatible: compatible,
//           issues: issues,
//           score: responsiveScore
//         };
//       });
      
//       return results;
//     } catch (error) {
//       console.error('Responsiveness test failed:', error);
//       return {
//         mobile: { compatible: false, issues: ['Analysis failed'], score: 0 },
//         tablet: { compatible: false, issues: ['Analysis failed'], score: 0 },
//         desktop: { compatible: false, issues: ['Analysis failed'], score: 0 }
//       };
//     }
//   };

//   const testSecurityVulnerabilities = async (testUrl, htmlContent) => {
//     try {
//       console.log('Security test started');
//       const vulnerabilities = {

//         xss: await testXSSVulnerabilities(testUrl, htmlContent),
//         sqlInjection: await testSQLInjection(testUrl, htmlContent),
//         commandInjection: await testCommandInjection(testUrl, htmlContent),
//         insecureHeaders: await testSecurityHeaders(testUrl)
//       };
      
//       return vulnerabilities;
//     } catch (error) {
//       console.error('Security testing failed:', error);
//       return {
//         xss: { detected: false, severity: 'unknown', error: 'Test failed' },
//         sqlInjection: { detected: false, severity: 'unknown', error: 'Test failed' },
//         commandInjection: { detected: false, severity: 'unknown', error: 'Test failed' },
//         insecureHeaders: { detected: false, severity: 'unknown', error: 'Test failed' }
//       };
//     }
//   };

//   const testXSSVulnerabilities = async (testUrl, htmlContent) => {
//     try {
//         console.log('Security test midway');

//       const xssIndicators = [
//         'document.write',
//         'innerHTML',
//         'eval(',
//         'javascript:',
//         '<script',
//         'onload=',
//         'onerror=',
//         'onclick='
//       ];
      
//       let detectedIndicators = [];
//       let riskLevel = 'low';
      
//       xssIndicators.forEach(indicator => {
//         const regex = new RegExp(indicator, 'gi');
//         const matches = htmlContent.match(regex);
//         if (matches) {
//           detectedIndicators.push(indicator);
//           if (['<script', 'eval(', 'javascript:'].includes(indicator)) {
//             riskLevel = 'high';
//           } else if (['innerHTML', 'document.write'].includes(indicator)) {
//             riskLevel = 'medium';
//           }
//         }
//       });
      
//       const inputFields = htmlContent.match(/<input[^>]*>/gi) || [];
//       const textareas = htmlContent.match(/<textarea[^>]*>/gi) || [];
//       const forms = htmlContent.match(/<form[^>]*>/gi) || [];
      
//       const potentialLocations = [];
//       if (inputFields.length > 0) potentialLocations.push('input fields');
//       if (textareas.length > 0) potentialLocations.push('text areas');
//       if (forms.length > 0) potentialLocations.push('forms');
      
//       return {
//         detected: detectedIndicators.length > 0,
//         severity: riskLevel,
//         locations: potentialLocations,
//         indicators: detectedIndicators,
//         riskFactors: {
//           inputFields: inputFields.length,
//           textareas: textareas.length,
//           forms: forms.length
//         }
//       };
//     } catch (error) {
//       return { detected: false, severity: 'unknown', error: error.message };
//     }
//   };

//   const testSQLInjection = async (testUrl, htmlContent) => {
//     try {
//       const sqlIndicators = [
//         'SELECT',
//         'INSERT',
//         'UPDATE',
//         'DELETE',
//         'DROP',
//         'UNION',
//         'WHERE',
//         'FROM',
//         'mysql_',
//         'pg_',
//         'sqlite_'
//       ];
      
//       let detectedIndicators = [];
//       let riskLevel = 'low';
      
//       sqlIndicators.forEach(indicator => {
//         const regex = new RegExp(indicator, 'gi');
//         const matches = htmlContent.match(regex);
//         if (matches) {
//           detectedIndicators.push(indicator);
//           if (['DROP', 'DELETE', 'INSERT', 'UPDATE'].includes(indicator.toUpperCase())) {
//             riskLevel = 'critical';
//           } else if (['SELECT', 'UNION', 'WHERE'].includes(indicator.toUpperCase())) {
//             riskLevel = 'high';
//           }
//         }
//       });
      
//       const forms = htmlContent.match(/<form[^>]*>/gi) || [];
//       const searchForms = htmlContent.match(/search|query|login/gi) || [];
      
//       const potentialLocations = [];
//       if (forms.length > 0) potentialLocations.push('forms');
//       if (searchForms.length > 0) potentialLocations.push('search functionality');
      
//       return {
//         detected: detectedIndicators.length > 0,
//         severity: riskLevel,
//         locations: potentialLocations,
//         indicators: detectedIndicators,
//         riskFactors: {
//           forms: forms.length,
//           searchElements: searchForms.length
//         }
//       };
//     } catch (error) {
//       return { detected: false, severity: 'unknown', error: error.message };
//     }
//   };

//   const testCommandInjection = async (testUrl, htmlContent) => {
//     try {
//       const commandIndicators = [
//         'exec(',
//         'system(',
//         'shell_exec',
//         'passthru',
//         'eval(',
//         'cmd',
//         'bash',
//         'sh ',
//         'powershell'
//       ];
      
//       let detectedIndicators = [];
//       let riskLevel = 'low';
      
//       commandIndicators.forEach(indicator => {
//         const regex = new RegExp(indicator, 'gi');
//         const matches = htmlContent.match(regex);
//         if (matches) {
//           detectedIndicators.push(indicator);
//           if (['exec(', 'system(', 'shell_exec', 'eval('].includes(indicator)) {
//             riskLevel = 'high';
//           } else if (['cmd', 'bash', 'powershell'].includes(indicator)) {
//             riskLevel = 'medium';
//           }
//         }
//       });
      
//       const fileInputs = htmlContent.match(/<input[^>]*type=["']file["'][^>]*>/gi) || [];
//       const uploadForms = htmlContent.match(/upload|file/gi) || [];
      
//       const potentialLocations = [];
//       if (fileInputs.length > 0) potentialLocations.push('file uploads');
//       if (uploadForms.length > 0) potentialLocations.push('upload functionality');
      
//       return {
//         detected: detectedIndicators.length > 0,
//         severity: riskLevel,
//         locations: potentialLocations,
//         indicators: detectedIndicators,
//         riskFactors: {
//           fileInputs: fileInputs.length,
//           uploadElements: uploadForms.length
//         }
//       };
//     } catch (error) {
//       return { detected: false, severity: 'unknown', error: error.message };
//     }
//   };

//   const testSecurityHeaders = async (testUrl) => {
//     try {
//       const requiredHeaders = {
//         'Content-Security-Policy': 'CSP',
//         'X-Frame-Options': 'Clickjacking Protection',
//         'X-XSS-Protection': 'XSS Protection',
//         'X-Content-Type-Options': 'MIME Sniffing Protection',
//         'Strict-Transport-Security': 'HSTS',
//         'Referrer-Policy': 'Referrer Policy'
//       };
      
//       const missingHeaders = [];
//       const presentHeaders = [];
      
      
//       Object.keys(requiredHeaders).forEach(header => {
//         let hasHeader = false;
        
//         if (testUrl.includes('https://')) {
//           hasHeader = Math.random() > 0.4;
//         } else {
//           hasHeader = Math.random() > 0.7;
//         }
        
//         if (hasHeader) {
//           presentHeaders.push(requiredHeaders[header]);
//         } else {
//           missingHeaders.push(requiredHeaders[header]);
//         }
//       });
      
//       return {
//         detected: missingHeaders.length > 0,
//         severity: missingHeaders.length > 3 ? 'high' : missingHeaders.length > 1 ? 'medium' : 'low',
//         missing: missingHeaders,
//         present: presentHeaders,
//         totalChecked: Object.keys(requiredHeaders).length,
//         note: 'Header analysis simulated due to CORS limitations'
//       };
//     } catch (error) {
//       return {
//         detected: true,
//         severity: 'medium',
//         error: 'Could not analyze security headers',
//         missing: ['Unable to verify headers due to CORS restrictions']
//       };
//     }
//   };

//   const testSEOFactors = async (htmlContent) => {
//     try {
    
//       const titleMatch = htmlContent.match(/<title[^>]*>([^<]*)<\/title>/i);
//       const titleTag = {
//         present: !!titleMatch,
//         content: titleMatch ? titleMatch[1].trim() : '',
//         length: titleMatch ? titleMatch[1].trim().length : 0
//       };
      
//       const metaDescMatch = htmlContent.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
//       const metaDescription = {
//         present: !!metaDescMatch,
//         content: metaDescMatch ? metaDescMatch[1].trim() : '',
//         length: metaDescMatch ? metaDescMatch[1].trim().length : 0
//       };
      
//       const h1Matches = htmlContent.match(/<h1[^>]*>/gi) || [];
//       const h2Matches = htmlContent.match(/<h2[^>]*>/gi) || [];
//       const h3Matches = htmlContent.match(/<h3[^>]*>/gi) || [];
      
//       let headingStructure = 'good';
//       if (h1Matches.length === 0) {
//         headingStructure = 'poor';
//       } else if (h1Matches.length > 1) {
//         headingStructure = 'needs improvement';
//       } else if (h2Matches.length === 0 && h3Matches.length > 0) {
//         headingStructure = 'needs improvement';
//       }
      
//       const headings = {
//         h1Count: h1Matches.length,
//         h2Count: h2Matches.length,
//         h3Count: h3Matches.length,
//         structure: headingStructure
//       };
      
//       const imgMatches = htmlContent.match(/<img[^>]*>/gi) || [];
//       let imagesWithoutAlt = 0;
      
//       imgMatches.forEach(img => {
//         if (!img.includes('alt=') || img.includes('alt=""') || img.includes("alt=''")) {
//           imagesWithoutAlt++;
//         }
//       });
      
//       const images = {
//         total: imgMatches.length,
//         withoutAlt: imagesWithoutAlt,
//         altCoverage: (imgMatches?.length > 0 && imagesWithoutAlt != null)
//   ? (((imgMatches.length - imagesWithoutAlt) / imgMatches.length) * 100).toFixed(1)
//   : '100'

//         // altCoverage: imgMatches.length > 0 ? ((imgMatches.length - imagesWithoutAlt) / imgMatches.length * 100).toFixed(1) : 100
//       };
      
//       const hasMetaViewport = htmlContent.includes('<meta name="viewport"');
//       const hasMetaRobots = htmlContent.includes('<meta name="robots"');
//       const hasCanonical = htmlContent.includes('<link rel="canonical"');
//       const hasOpenGraph = htmlContent.includes('property="og:');
//       const hasStructuredData = htmlContent.includes('application/ld+json') || htmlContent.includes('schema.org');
      
//       return {
//         titleTag,
//         metaDescription,
//         headings,
//         images,
//         additionalFactors: {
//           hasMetaViewport,
//           hasMetaRobots,
//           hasCanonical,
//           hasOpenGraph,
//           hasStructuredData
//         },
//         seoScore: calculateSEOScore(titleTag, metaDescription, headings, images, {
//           hasMetaViewport,
//           hasMetaRobots,
//           hasCanonical,
//           hasOpenGraph,
//           hasStructuredData
//         })
//       };
//     } catch (error) {
//       console.error('SEO analysis failed:', error);
//       return {
//         titleTag: { present: false, content: '', length: 0 },
//         metaDescription: { present: false, content: '', length: 0 },
//         headings: { h1Count: 0, h2Count: 0, h3Count: 0, structure: 'unknown' },
//         images: { total: 0, withoutAlt: 0, altCoverage: 0 },
//         error: error.message
//       };
//     }
//   };

//   const calculateSEOScore = (title, meta, headings, images, additional) => {
//     let score = 0;
    
//     if (title.present) {
//       score += 15;
//       if (title.length >= 30 && title.length <= 60) score += 10;
//     }
    
//     if (meta.present) {
//       score += 10;
//       if (meta.length >= 120 && meta.length <= 160) score += 10;
//     }
    
//     if (headings.h1Count === 1) {
//       score += 10;
//       if (headings.h2Count > 0) score += 5;
//       if (headings.structure === 'good') score += 5;
//     }
    
//     if (images.total > 0) {
//       score += 5;
//       const altPercentage = ((images.total - images.withoutAlt) / images.total) * 100;
//       if (altPercentage >= 90) score += 10;
//       else if (altPercentage >= 70) score += 5;
//     } else {
//       score += 15; // No images is not necessarily bad
//     }
    
//     if (additional.hasMetaViewport) score += 5;
//     if (additional.hasCanonical) score += 5;
//     if (additional.hasOpenGraph) score += 5;
//     if (additional.hasStructuredData) score += 5;
    
//     return Math.min(100, score);
//   };

 
// const analyzeWebsite  = async () => {
//   if (!validateUrl(url)) {
//     alert('Please enter a valid URL (must start with http:// or https://)');
//     return;
//   }

//   setLoading(true);
//   setResults(null);
//   setScreenshot(null);
//   setProgress(0);

//   try {
//     // 1. Capture Screenshot
//     setCurrentTest('Capturing website screenshot...');
//     await new Promise(resolve => setTimeout(resolve, 500));

//     const screenshotResult = await captureScreenshot(url);
//     setScreenshot(screenshotResult);
//     setProgress(16);

//     // 2. Performance Test
//     setCurrentTest('Testing website performance...');
//     await new Promise(resolve => setTimeout(resolve, 500));

//     const performanceResults = await testWebsitePerformance(url);
//     console.log('performanceResults',performanceResults)
//     setProgress(33);

//     // 3. Fetch HTML Content
//     setCurrentTest('Fetching website HTML content...');
//     await new Promise(resolve => setTimeout(resolve, 500));

//     const htmlResponse = await fetch('http://localhost:3001/api/fetch-html', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ url }),
//     });

//     if (!htmlResponse.ok) {
//       throw new Error(`Failed to fetch HTML content: ${htmlResponse.status}`);
//     }

//     const { html: htmlContent } = await htmlResponse.json();
//     console.log("Fetched HTML content length:", htmlContent?.length);
//     console.log("Starting html analysis...");

//     // 4. Responsive Design Test
//     let responsivenessResults = {};
//     try {
//       setCurrentTest('Checking responsive design...');
//       await new Promise(resolve => setTimeout(resolve, 500));

//       responsivenessResults = await testResponsiveness(htmlContent);
//       setProgress(50);
//       console.log("✅ Responsiveness Results:", responsivenessResults);
//     } catch (err) {
//       console.error("❌ Responsiveness Test Failed:", err);
//     }

//     // 5. Security Test
//     let securityResults = {};
//     try {
//       setCurrentTest('Scanning for security vulnerabilities...');
//       await new Promise(resolve => setTimeout(resolve, 500));

//       securityResults = await testSecurityVulnerabilities(url, htmlContent);
//       setProgress(75);
//       console.log("✅ Security Results:", securityResults);
//     } catch (err) {
//       console.error("❌ Security Test Failed:", err);
//     }

//     // 6. SEO Test
//     let seoResults = {};
//     try {
//       setCurrentTest('Analyzing SEO factors...');
//       await new Promise(resolve => setTimeout(resolve, 500));

//       seoResults = await testSEOFactors(htmlContent);
//       setProgress(100);
//       console.log("✅ SEO Results:", seoResults);
//     } catch (err) {
//       console.error("❌ SEO Test Failed:", err);
//     }

//     // 7. Compile Final Results
//     setCurrentTest('Analysis complete!');
//     const finalResults = {
//       url,
//       timestamp: new Date().toISOString(),
//       performance: performanceResults,
//       responsiveness: responsivenessResults,
//       security: securityResults,
//       seo: seoResults,
//       overallScore: calculateOverallScore(
//         performanceResults,
//         responsivenessResults,
//         securityResults,
//         seoResults
//       ),
//     };

//     console.log('💡 Final Results Being Set:', finalResults);
//     setResults(finalResults);
//   } catch (error) {
//     console.error('❌ Error compiling final results:', error);
//     alert('An error occurred during analysis. Please try again.');
//   } finally {
//     setLoading(false);
//     setCurrentTest('');
//   }
// };

// // const analyzeWebsite = async () => {
// //   if (!validateUrl(url)) {
// //     alert('Please enter a valid URL (must start with http:// or https://)');
// //     return;
// //   }

// //   setLoading(true);
// //   setResults(null);
// //   setScreenshot(null);
// //   setProgress(0);

// //   try {
// //     setCurrentTest('Capturing website screenshot...');
// //     const screenshotResult = await captureScreenshot(url);
// //     setScreenshot(screenshotResult);
// //     setProgress(16);

// //     setCurrentTest('Testing website performance...');
// //     const performanceResults = await testWebsitePerformance(url);
// //     setProgress(33);

   
// // setCurrentTest('Fetching website HTML content...');
// // const htmlResponse = await fetch('http://localhost:3001/api/fetch-html', {
// //   method: 'POST',
// //   headers: { 'Content-Type': 'application/json' },
// //   body: JSON.stringify({ url }),
// // });
// // // const { html } = await htmlResponse.json(); // Parse HTML string
// // // console.log("Fetched HTML:\n", html); 
// // if (!htmlResponse.ok) throw new Error(`Failed to fetch HTML content: ${htmlResponse.status}`);
// // const { html: htmlContent } = await htmlResponse.json();
// // console.log("Length:", htmlContent?.length);

// // // console.log('Startinghtml',html);
// // console.log('Starting html: htmlContent',{html: htmlContent});

// //     setCurrentTest('Checking responsive design...');
// //     let responsivenessResults = {};
// // try {
// //   setCurrentTest('Checking responsive design...');
// //   responsivenessResults = await testResponsiveness(htmlContent);
// //   setProgress(50);
// //   console.log("✅ Responsiveness Results:", responsivenessResults);
// // } catch (err) {
// //   console.error("❌ Responsiveness Test Failed:", err);
// // }

// // let securityResults = {};
// // try {
// //   setCurrentTest('Scanning for security vulnerabilities...');
// //   securityResults = await testSecurityVulnerabilities(url, htmlContent);
// //   setProgress(75);
// //   console.log("✅ Security Results:", securityResults);
// // } catch (err) {
// //   console.error("❌ Security Test Failed:", err);
// // }

// // let seoResults = {};
// // try {
// //   setCurrentTest('Analyzing SEO factors...');
// //   seoResults = await testSEOFactors(htmlContent);
// //   setProgress(100);
// //   console.log("✅ SEO Results:", seoResults);
// // } catch (err) {
// //   console.error("❌ SEO Test Failed:", err);
// // }

// // //     const responsivenessResults = await testResponsiveness(htmlContent);
// // //     setProgress(50);
    
// // //     console.log('Checking responsive design. complete ');
// // //     console.log('Starting security test start ');
// // //     setCurrentTest('Scanning for security vulnerabilities...');
// // //     const securityResults = await testSecurityVulnerabilities(url, htmlContent);
// // //     setProgress(75);
// // // console.log('Starting SEO test complete');
// // // console.log('Analyzing SEO factors start');

// // //     setCurrentTest('Analyzing SEO factors...');
// // //     const seoResults = await testSEOFactors(htmlContent);
// // //     setProgress(100);
// // // console.log('Analyzing SEO factors complete');

// //     setCurrentTest('Analysis complete!');

// //     const finalResults = {
// //       url: url,
// //       timestamp: new Date().toISOString(),
// //       performance: performanceResults,
// //       responsiveness: responsivenessResults,
// //       security: securityResults,
// //       seo: seoResults,
// //       overallScore: calculateOverallScore(performanceResults, responsivenessResults, securityResults, seoResults)
// //     };
// // console.log('💡 Final Results Being Set:', finalResults);

// //     setResults(finalResults);
// //     console.log("finalResults",finalResults)
// //   } catch (error) {
// //     console.error('Error compiling final results:', error);
// //     alert('An error occurred during analysis. Please try again.');
// //   } finally {
// //     setLoading(false);
// //     setCurrentTest('');
// //   }
// // };


 

// // const calculateOverallScore = (perf = {}, resp = {}, sec = {}, seo = {}) => {
// //   let score = 100;

// //   if ((perf.loadTime ?? 0) > 3) score -= 20;
// //   else if ((perf.loadTime ?? 0) > 2) score -= 10;

// //   Object.values(resp).forEach(viewport => {
// //     if (!viewport.compatible) score -= 15;
// //   });

// //   Object.values(sec).forEach(vuln => {
// //     if (vuln.detected) {
// //       if (vuln.severity === 'critical') score -= 30;
// //       else if (vuln.severity === 'high') score -= 20;
// //       else if (vuln.severity === 'medium') score -= 10;
// //     }
// //   });

// //   if (!seo.titleTag?.present) score -= 10;
// //   if (!seo.metaDescription?.present) score -= 5;
// //   if ((seo.images?.withoutAlt ?? 0) > 0) score -= 5;

// //   return Math.max(0, score);
// // };


// const calculateOverallScore = (perf = {}, resp = {}, sec = {}, seo = {}) => {
//   let score = 100;

//   // Performance penalties
//   if ((perf.loadTime ?? 0) > 3) score -= 20;
//   else if ((perf.loadTime ?? 0) > 2) score -= 10;

//   // Responsiveness penalties
//   Object.values(resp).forEach(viewport => {
//     if (!viewport.compatible) score -= 15;
//   });

//   // Security penalties
//   Object.values(sec).forEach(vuln => {
//     if (vuln.detected) {
//       if (vuln.severity === 'critical') score -= 30;
//       else if (vuln.severity === 'high') score -= 20;
//       else if (vuln.severity === 'medium') score -= 10;
//     }
//   });

//   // SEO penalties
//   if (!seo.titleTag?.present) score -= 10;
//   if (!seo.metaDescription?.present) score -= 5;
//   if ((seo.images?.withoutAlt ?? 0) > 0) score -= 5;

//   score = Math.max(0, score);

//   // Grade & Summary
//   let grade = '';
//   let summary = '';

//   if (score >= 90) {
//     grade = 'A';
//     summary = 'Excellent overall performance';
//   } else if (score >= 80) {
//     grade = 'B+';
//     summary = 'Fast load time and good SEO, but some issues exist';
//   } else if (score >= 70) {
//     grade = 'B';
//     summary = 'Decent site health with room for improvement';
//   } else if (score >= 60) {
//     grade = 'C';
//     summary = 'Multiple issues affecting performance or security';
//   } else if (score >= 50) {
//     grade = 'D';
//     summary = 'Serious issues detected across key areas';
//   } else {
//     grade = 'F';
//     summary = 'Site has major flaws in speed, SEO, or security';
//   }

//   return { score, grade, summary };
// };


//   const renderResults = () => {
//       console.log('Rendering results:', results);

//     if (!results) return null;

//     return (
//       <div className="results">
//         {/* <div className="overall-score">
//           <h3>Overall Score: <span className={getScoreClass(results.overallScore)}>{results.overallScore}/100</span></h3>
//         </div> */}
//         <div className="overall-score">
//   <h3>
//     Overall Score:{" "}
//     <span className={getScoreClass(results.overallScore.score)}>
//       {results.overallScore.score}/100
//     </span>
//   </h3>
//   <p><strong>Grade:</strong> {results.overallScore.grade}</p>
//   <p><strong>Summary:</strong> {results.overallScore.summary}</p>
// </div>


//         {screenshot && (
//           <div className="screenshot-section">
//             <h4>📸 Website Preview</h4>
//             <div className="screenshot-container">
//               {screenshot.success ? (
//                 <>
//                   <img 
//                     src={screenshot.url} 
//                     alt={`Screenshot of ${results.url}`}
//                     className="website-screenshot"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                       e.target.nextSibling.style.display = 'block';
//                     }}
//                   />
//                   <div className="screenshot-fallback" style={{display: 'none'}}>
//                     <p>📷 Screenshot could not be loaded</p>
//                     <p><small>Website: {results.url}</small></p>
//                   </div>
//                 </>
//               ) : (
//                 <div className="screenshot-error">
//                   <p>❌ Screenshot capture failed</p>
//                   <p><small>Error: {screenshot.error || 'Unknown error'}</small></p>
//                 </div>
//               )}
//               <div className="screenshot-info">
//                 <p><strong>URL:</strong> {results.url}</p>
//                 <p><small>Captured on: {new Date(screenshot.timestamp).toLocaleString()}</small></p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div className="test-sections">
//          <div className="test-section">
//   <h4>⚡ Performance</h4>
//   <div className="test-results">
//     <p>
//       <strong>Load Time:</strong>{" "}
//       {results?.performance?.performance?.loadTime
//         ? (results.performance.performance.loadTime / 1000).toFixed(2) + "s"
//         : "N/A"}
//     </p>
//     <p>
//       <strong>Page Size:</strong>{" "}
//       {results?.performance?.performance?.size ?? "N/A"} KB
//     </p>
//     <p>
//       <strong>HTTP Requests:</strong>{" "}
//       {results?.performance?.performance?.requests ?? "N/A"}
//     </p>
//     <div
//       className={`status-indicator ${
//         results?.performance?.performance?.loadTime < 2000
//           ? "good"
//           : results?.performance?.performance?.loadTime < 4000
//           ? "warning"
//           : "bad"
//       }`}
//     >
//       {results?.performance?.performance?.loadTime < 2000
//         ? "✅ Excellent"
//         : results?.performance?.performance?.loadTime < 4000
//         ? "⚠️ Needs Improvement"
//         : "❌ Poor"}
//     </div>
//   </div>
// </div>


//           <div className="test-section">
//             <h4>📱 Responsiveness</h4>
//             <div className="test-results">
//               {Object.entries(results.responsiveness).map(([viewport, data]) => (
//                 <div key={viewport} className="responsive-test">
//                   <p><strong>{viewport.charAt(0).toUpperCase() + viewport.slice(1)}:</strong> 
//                     <span className={data.compatible ? 'good' : 'bad'}>
//                       {data.compatible ? ' ✅ Compatible' : ' ❌ Issues detected'}
//                     </span>
//                   </p>
//                   {data.issues.length > 0 && (
//                     <ul className="issues-list">
//                       {data.issues.map((issue, index) => (
//                         <li key={index}>{issue}</li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="test-section">
//             <h4>🔒 Security</h4>
//             <div className="test-results">
//               {Object.entries(results.security).map(([vulnType, data]) => (
//                 <div key={vulnType} className="security-test">
//                   <p><strong>{vulnType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>
//                     <span className={data.detected ? 'bad' : 'good'}>
//                       {data.detected ? ` ❌ Detected (${data.severity})` : ' ✅ Not detected'}
//                     </span>
//                   </p>
//                   {data.detected && data.locations && data.locations.length > 0 && (
//                     <p className="vulnerability-locations">
//                       Found in: {data.locations.join(', ')}
//                     </p>
//                   )}
//                   {data.missing && (
//                     <p className="missing-headers">
//                       Missing: {data.missing.join(', ')}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="test-section">
//             <h4>🔍 SEO</h4>
//             <div className="test-results">
//               <p><strong>Title Tag:</strong> 
//                 <span className={results.seo.titleTag.present ? 'good' : 'bad'}>
//                   {results.seo.titleTag.present ? ` ✅ Present (${results.seo.titleTag.length} chars)` : ' ❌ Missing'}
//                 </span>
//               </p>
//               <p><strong>Meta Description:</strong> 
//                 <span className={results.seo.metaDescription.present ? 'good' : 'bad'}>
//                   {results.seo.metaDescription.present ? ` ✅ Present (${results.seo.metaDescription.length} chars)` : ' ❌ Missing'}
//                 </span>
//               </p>
//               <p><strong>Heading Structure:</strong> 
//                 <span className={results.seo.headings.structure === 'good' ? 'good' : 'warning'}>
//                   {results.seo.headings.structure === 'good' ? ' ✅ Good' : ' ⚠️ Needs improvement'}
//                 </span>
//               </p>
//               <p><strong>Images:</strong> {results.seo.images.total} total, 
//                 <span className={results.seo.images.withoutAlt === 0 ? 'good' : 'warning'}>
//                   {results.seo.images.withoutAlt} without alt text
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="recommendations">
//           <h4>🚀 Recommendations</h4>
//           <ul>
// {results.performance.loadTime > 3 && (
//               <li>
//                 <strong>Load Time Issue:</strong> Page is loading slowly due to large images or too many HTTP requests. Consider image optimization and reducing requests.
//               </li>
//             )}
//             {Object.values(results.responsiveness).some(v => !v.compatible) && (
//               <li>
//                 <strong>Responsiveness Issue:</strong> The website has layout problems on mobile devices. Ensure elements adapt to different screen sizes properly.
//               </li>
//             )}
//             {Object.entries(results.security).map(([type, data]) => {
//               if (data.detected) {
//                 return (
//                   <li key={type}>
//                     <strong>{type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Detected:</strong> {data.severity} risk. Found vulnerabilities in {Array.isArray(data.locations) && data.locations.length > 0 ? data.locations.join(', ') : 'unspecified locations'}. Apply security patches and input validation.
//                   </li>
//                 );
//               }
//               return null;
//             })}
//             {!results.seo.titleTag.present && (
//               <li>
//                 <strong>SEO Issue:</strong> Missing title tag can affect search engine ranking. Add a relevant title to every page.
//               </li>
//             )}
//             {!results.seo.metaDescription.present && (
//               <li>
//                 <strong>SEO Issue:</strong> Meta descriptions are missing. Provide summaries to enhance search result display.
//               </li>
//             )}
//             {results.seo.images.withoutAlt > 0 && (
//               <li>
//                 <strong>SEO/Accessibility Issue:</strong> Some images do not have alt text. Add alt attributes to improve accessibility and SEO.
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     );
//   };

//   const getScoreClass = (score) => {
//     if (score >= 80) return 'excellent';
//     if (score >= 60) return 'good';
//     if (score >= 40) return 'warning';
//     return 'poor';
//   };

//   return (
//     <div className="website-tester">
//       <div className="input-section">
//         <h2> Website Analysis</h2>
//         <p>Enter a website URL to analyze its security, performance, responsiveness, and SEO</p>
        
//         <div className="url-input">
//           <input
//             type="text"
//             placeholder="https://example.com"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//             disabled={loading}
//           />
//           <button onClick={analyzeWebsite} disabled={loading || !url}>
//             {loading ? 'Analyzing...' : 'Start Analysis'}
//           </button>
//         </div>

//         {loading && (
//           <div className="progress-section">
//             <div className="progress-bar">
//               <div className="progress-fill" style={{ width: `${progress}%` }}></div>
//             </div>
//             <p className="progress-text">{currentTest}</p>
//             <p className="progress-percentage">{progress}%</p>
//           </div>
//         )}
//       </div>

//       {renderResults()}

//       <div className="attack-examples">
//         <h3>🚨 Common Attack Patterns We Test For</h3>
//         <div className="attack-grid">
//           <div className="attack-category">
//             <h4>XSS (Cross-Site Scripting)</h4>
//             <ul>
//               {securityTests.xssPayloads.slice(0, 3).map((payload, index) => (
//                 <li key={index}><code>{payload}</code></li>
//               ))}
//             </ul>
//           </div>
          
//           <div className="attack-category">
//             <h4>SQL Injection</h4>
//             <ul>
//               {securityTests.sqlPayloads.slice(0, 3).map((payload, index) => (
//                 <li key={index}><code>{payload}</code></li>
//               ))}
//             </ul>
//           </div>
          
//           <div className="attack-category">
//             <h4>Command Injection</h4>
//             <ul>
//               {securityTests.commandPayloads.slice(0, 3).map((payload, index) => (
//                 <li key={index}><code>{payload}</code></li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WebsiteTester;



import React, { useState } from 'react';
import './WebsiteTester.css';

const WebsiteTester = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [error, setError] = useState(null);

  const securityTests = {
    xssPayloads: [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '" onmouseover=alert("XSS")'
    ],
    sqlPayloads: [
      "' OR '1'='1",
      "' UNION SELECT null,version()--",
      "'; DROP TABLE users--"
    ]
  };

  const validateUrl = (inputUrl) => {
    try {
      const urlObj = new URL(inputUrl);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const analyzeWebsite = async () => {
    if (!validateUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);
    setResults(null);
    setScreenshot(null);
    setError(null);
    setProgress(0);

    try {
      const tests = [
        { name: 'Initializing analysis...', progress: 5 },
        { name: 'Capturing website screenshot...', progress: 15 },
        { name: 'Testing website performance...', progress: 30 },
        { name: 'Analyzing page content...', progress: 45 },
        { name: 'Checking responsive design...', progress: 60 },
        { name: 'Scanning for security vulnerabilities...', progress: 75 },
        { name: 'Analyzing SEO factors...', progress: 90 },
        { name: 'Compiling final report...', progress: 100 }
      ];

      for (const test of tests) {
        setCurrentTest(test.name);
        setProgress(test.progress);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // const response = await fetch('http://localhost:3001/api/analyze', {
      const response = await fetch('https://testing-tool-backend.vercel.app/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'Analysis failed');
      }

      setResults(data);
      setScreenshot(data.screenshot);
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'warning';
    return 'poor';
  };

  const renderSecurityResults = (security) => {
    const xss = security?.xss || {};
    const sqlInjection = security?.sqlInjection || {};
    const headers = security?.headers || {};
    
    return (
      <div className="security-results">
        <h4>🔒 Security</h4>
        <div className="test-grid">
          <div className="test-item">
            <h5>XSS Vulnerabilities</h5>
            <p className={xss.detected ? 'bad' : 'good'}>
              {xss.detected ? '❌ Detected' : '✅ Not detected'}
            </p>
            {xss.detected && xss.tests && (
              <div className="test-details">
                <p>Severity: {xss.tests.find(t => t.vulnerable)?.severity || 'unknown'}</p>
                <ul>
                  {xss.tests.filter(t => t.vulnerable).map((test, i) => (
                    <li key={i}>Payload: <code>{test.payload}</code></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="test-item">
            <h5>SQL Injection</h5>
            <p className={sqlInjection.detected ? 'bad' : 'good'}>
              {sqlInjection.detected ? '❌ Detected' : '✅ Not detected'}
            </p>
            {sqlInjection.detected && sqlInjection.tests && (
              <div className="test-details">
                <p>Severity: {sqlInjection.tests.find(t => t.vulnerable)?.severity || 'unknown'}</p>
                <ul>
                  {sqlInjection.tests.filter(t => t.vulnerable).map((test, i) => (
                    <li key={i}>Payload: <code>{test.payload}</code></li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="test-item">
            <h5>Security Headers</h5>
            <p className={headers.detected ? 'warning' : 'good'}>
              {headers.detected ? '⚠️ Issues found' : '✅ All secure'}
            </p>
            {headers.detected && headers.missing && (
              <div className="test-details">
                <p>Missing headers:</p>
                <ul>
                  {headers.missing.map((header, i) => (
                    <li key={i}>{header}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    const security = results.security || {};
    const performance = results.performance || {};
    const seo = results.seo || {};
    const responsiveness = results.responsiveness || {};

    return (
      <div className="results">
        <div className="overall-score">
          <h3>Overall Score: <span className={getScoreClass(results.overallScore)}>
            {Math.round(results.overallScore)}/100
          </span></h3>
        </div>

        {screenshot && (
          <div className="screenshot-section">
            <h4>📸 Website Preview</h4>
            <div className="screenshot-container">
              <img 
                src={screenshot} 
                alt={`Screenshot of ${results.url}`}
                className="website-screenshot"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="screenshot-fallback" style={{display: 'none'}}>
                <p>📷 Screenshot could not be loaded</p>
                <p><small>Website: {results.url}</small></p>
              </div>
              <div className="screenshot-info">
                <p><strong>URL:</strong> {results.url}</p>
                <p><small>Analyzed at: {new Date(results.timestamp).toLocaleString()}</small></p>
              </div>
            </div>
          </div>
        )}
        
        <div className="test-sections">
          <div className="test-section">
            <h4>⚡ Performance</h4>
            <div className="test-results">
              <p><strong>Load Time:</strong> {performance.loadTime?.toFixed(2) || 'N/A'}s</p>
              <p><strong>Page Size:</strong> {performance.size || 'N/A'} KB</p>
              <p><strong>Requests:</strong> {performance.requests || 'N/A'}</p>
              <p><strong>Lighthouse Score:</strong> {performance.lighthouseScore || 0}/100</p>
              <div className={`status-indicator ${performance.loadTime < 2 ? 'good' : performance.loadTime < 4 ? 'warning' : 'bad'}`}>
                {performance.loadTime < 2 ? '✅ Excellent' : 
                 performance.loadTime < 4 ? '⚠️ Needs Improvement' : '❌ Poor'}
              </div>
            </div>
          </div>

          <div className="test-section">
            <h4>📱 Responsiveness</h4>
            <div className="test-results">
              {Object.entries(responsiveness).map(([viewport, data]) => (
                <div key={viewport} className="responsive-test">
                  <p><strong>{viewport.charAt(0).toUpperCase() + viewport.slice(1)}:</strong> 
                    <span className={data.compatible ? 'good' : data.error ? 'warning' : 'bad'}>
                      {data.compatible ? ' ✅ Compatible' : 
                       data.error ? ' ⚠️ Error' : ' ❌ Issues detected'}
                    </span>
                  </p>
                  {data.issues && data.issues.length > 0 && (
                    <ul className="issues-list">
                      {data.issues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  )}
                  {data.error && <p className="error">Error: {data.error}</p>}
                </div>
              ))}
            </div>
          </div>

          {renderSecurityResults(security)}

          <div className="test-section">
            <h4>🔍 SEO</h4>
            <div className="test-results">
              <p><strong>Title Tag:</strong> 
                <span className={seo.title ? 'good' : 'bad'}>
                  {seo.title ? ` ✅ Present (${seo.titleLength} chars)` : ' ❌ Missing'}
                </span>
              </p>
              <p><strong>Meta Description:</strong> 
                <span className={seo.metaDescription ? 'good' : 'bad'}>
                  {seo.metaDescription ? ` ✅ Present (${seo.descriptionLength} chars)` : ' ❌ Missing'}
                </span>
              </p>
              <p><strong>Heading Structure:</strong> 
                <span className={seo.headings?.structure === 'good' ? 'good' : 'warning'}>
                  {seo.headings?.structure === 'good' ? ' ✅ Good' : ' ⚠️ Needs improvement'}
                </span>
              </p>
              <p><strong>Images:</strong> {seo.images?.total || 0} total, 
                <span className={seo.images?.withoutAlt === 0 ? 'good' : 'warning'}>
                  {seo.images?.withoutAlt || 0} without alt text
                </span>
              </p>
              <p><strong>Structured Data:</strong> 
                <span className={seo.structuredData > 0 ? 'good' : 'warning'}>
                  {seo.structuredData > 0 ? ` ✅ Found ${seo.structuredData} items` : ' ⚠️ Not detected'}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="recommendations">
          <h4>🚀 Recommendations</h4>
          <ul>
            {performance.loadTime > 3 && (
              <li><strong>Performance:</strong> Optimize images and reduce HTTP requests</li>
            )}
            
            {Object.values(responsiveness).some(v => !v.compatible) && (
              <li><strong>Responsiveness:</strong> Implement responsive design techniques</li>
            )}
            
            {security.xss?.detected && (
              <li><strong>Security:</strong> Sanitize user input to prevent XSS attacks</li>
            )}
            
            {security.sqlInjection?.detected && (
              <li><strong>Security:</strong> Use parameterized queries to prevent SQL injection</li>
            )}
            
            {security.headers?.detected && (
              <li><strong>Security:</strong> Add missing security headers</li>
            )}
            
            {!seo.title && (
              <li><strong>SEO:</strong> Add a descriptive title tag to every page</li>
            )}
            
            {seo.images?.withoutAlt > 0 && (
              <li><strong>SEO:</strong> Add alt text to images for accessibility</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="website-tester">
      <div className="input-section">
        <h2>Advanced Website Analysis</h2>
        <p>Test security, performance, responsiveness, and SEO of any website</p>
        
        {error && <div className="error-banner">{error}</div>}
        
        <div className="url-input">
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
          />
          <button onClick={analyzeWebsite} disabled={loading || !url}>
            {loading ? 'Analyzing...' : 'Start Analysis'}
          </button>
        </div>

        {loading && (
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{currentTest}</p>
            <p className="progress-percentage">{progress}%</p>
          </div>
        )}
      </div>

      {renderResults()}

      <div className="attack-examples">
        <h3>🚨 Security Tests Performed</h3>
        <div className="attack-grid">
          <div className="attack-category">
            <h4>XSS (Cross-Site Scripting)</h4>
            <ul>
              {securityTests.xssPayloads.map((payload, index) => (
                <li key={index}><code>{payload}</code></li>
              ))}
            </ul>
          </div>
          
          <div className="attack-category">
            <h4>SQL Injection</h4>
            <ul>
              {securityTests.sqlPayloads.map((payload, index) => (
                <li key={index}><code>{payload}</code></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteTester;
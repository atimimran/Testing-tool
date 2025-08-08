// import React, { useState, useEffect, useRef } from 'react';
// import DOMPurify from 'dompurify';
// import validator from 'validator';
// import { decode } from 'he';
// import xss from 'xss';
// import './SecureTextInput.css';

// const SecureTextInput = ({
//   placeholder = "Enter text...",
//   maxLength = 1000,
//   allowedChars = null,
//   preventSQLInjection = true,
//   preventXSS = true,
//   preventScriptInjection = true,
//   sanitizeInput = true,
//   showSecurityStatus = true,
//   onSecureChange = () => {},
//   onSecurityAlert = () => {},
//   label = "",
//   type = "text",
//   multiline = false,
//   rows = 4,
//   required = false,
//   disabled = false
// }) => {
//   const [inputValue, setInputValue] = useState('');
//   const [sanitizedValue, setSanitizedValue] = useState('');
//   const [securityStatus, setSecurityStatus] = useState({
//     isSafe: true,
//     threats: [],
//     riskLevel: 'low'
//   });
//   const [isValid, setIsValid] = useState(true);
//   const [errorMessage, setErrorMessage] = useState('');
//   const inputRef = useRef(null);

//   // Common attack patterns
//   const attackPatterns = {
//     xss: [
//       /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
//       /javascript:/gi,
//       /on\w+\s*=/gi,
//       /<iframe[\s\S]*?>/gi,
//       /<object[\s\S]*?>/gi,
//       /<embed[\s\S]*?>/gi,
//       /<link[\s\S]*?>/gi,
//       /<meta[\s\S]*?>/gi,
//       /expression\s*\(/gi,
//       /vbscript:/gi,
//       /data:text\/html/gi
//     ],
//     sqlInjection: [
//       /('|(\\')|(;)|(--)|(\s+(or|OR)\s+))/g,
//       /(union|UNION)[\s\S]+(select|SELECT)/gi,
//       /(drop|DROP)[\s\S]+(table|TABLE|database|DATABASE)/gi,
//       /(insert|INSERT)[\s\S]+(into|INTO)/gi,
//       /(delete|DELETE)[\s\S]+(from|FROM)/gi,
//       /(update|UPDATE)[\s\S]+(set|SET)/gi,
//       /(exec|EXEC|execute|EXECUTE)/gi,
//       /(\b(sp_|xp_)\w+)/gi
//     ],
//     htmlInjection: [
//       /<[^>]*>/g,
//       /&lt;[\s\S]*?&gt;/g,
//       /&#x?\d+;/g
//     ],
//     pathTraversal: [
//       /\.\.\//g,
//       /\.\.\\]/g,
//       /%2e%2e%2f/gi,
//       /%2e%2e%5c/gi
//     ],
//     commandInjection: [
//       /[;&|`$(){}[\]]/g,
//       /\b(cat|ls|dir|type|more|head|tail|grep|find|ps|kill|rm|del|mv|cp|copy|wget|curl)\b/gi
//     ]
//   };

//   // Sanitize input based on security settings
//   const sanitizeText = (text) => {
//     let sanitized = text;

//     try {
//       // HTML entity decode first
//       sanitized = decode(sanitized);

//       // XSS protection
//       if (preventXSS) {
//         sanitized = DOMPurify.sanitize(sanitized, { 
//           ALLOWED_TAGS: [],
//           ALLOWED_ATTR: []
//         });
//         sanitized = xss(sanitized, {
//           whiteList: {},
//           stripIgnoreTag: true,
//           stripIgnoreTagBody: ['script']
//         });
//       }

//       // Remove HTML tags if script injection prevention is enabled
//       if (preventScriptInjection) {
//         sanitized = sanitized.replace(/<[^>]*>/g, '');
//       }

//       // Character filtering
//       if (allowedChars) {
//         const regex = new RegExp(`[^${allowedChars}]`, 'g');
//         sanitized = sanitized.replace(regex, '');
//       }

//       // Length limitation
//       if (sanitized.length > maxLength) {
//         sanitized = sanitized.substring(0, maxLength);
//       }

//       return sanitized;
//     } catch (error) {
//       console.error('Sanitization error:', error);
//       return '';
//     }
//   };

//   // Analyze security threats
//   const analyzeThreats = (text) => {
//     const threats = [];
//     let riskLevel = 'low';

//     // Check for XSS patterns
//     if (preventXSS) {
//       attackPatterns.xss.forEach((pattern, index) => {
//         if (pattern.test(text)) {
//           threats.push({
//             type: 'XSS',
//             pattern: `XSS Pattern ${index + 1}`,
//             description: 'Potential Cross-Site Scripting attack detected'
//           });
//           riskLevel = 'high';
//         }
//       });
//     }

//     // Check for SQL injection patterns
//     if (preventSQLInjection) {
//       attackPatterns.sqlInjection.forEach((pattern, index) => {
//         if (pattern.test(text)) {
//           threats.push({
//             type: 'SQL_INJECTION',
//             pattern: `SQL Pattern ${index + 1}`,
//             description: 'Potential SQL injection attack detected'
//           });
//           riskLevel = riskLevel === 'high' ? 'high' : 'medium';
//         }
//       });
//     }

//     // Check for HTML injection
//     attackPatterns.htmlInjection.forEach((pattern, index) => {
//       if (pattern.test(text)) {
//         threats.push({
//           type: 'HTML_INJECTION',
//           pattern: `HTML Pattern ${index + 1}`,
//           description: 'Potential HTML injection detected'
//         });
//         riskLevel = riskLevel === 'high' ? 'high' : 'medium';
//       }
//     });

//     // Check for path traversal
//     attackPatterns.pathTraversal.forEach((pattern, index) => {
//       if (pattern.test(text)) {
//         threats.push({
//           type: 'PATH_TRAVERSAL',
//           pattern: `Path Pattern ${index + 1}`,
//           description: 'Potential path traversal attack detected'
//         });
//         riskLevel = riskLevel === 'high' ? 'high' : 'medium';
//       }
//     });

//     // Check for command injection
//     attackPatterns.commandInjection.forEach((pattern, index) => {
//       if (pattern.test(text)) {
//         threats.push({
//           type: 'COMMAND_INJECTION',
//           pattern: `Command Pattern ${index + 1}`,
//           description: 'Potential command injection detected'
//         });
//         riskLevel = 'high';
//       }
//     });

//     return { threats, riskLevel };
//   };

//   // Validate input
//   const validateInput = (text) => {
//     setErrorMessage('');
//     setIsValid(true);

//     if (required && !text.trim()) {
//       setErrorMessage('This field is required');
//       setIsValid(false);
//       return false;
//     }

//     if (text.length > maxLength) {
//       setErrorMessage(`Text exceeds maximum length of ${maxLength} characters`);
//       setIsValid(false);
//       return false;
//     }

//     // Additional validation based on type
//     if (type === 'email' && text && !validator.isEmail(text)) {
//       setErrorMessage('Please enter a valid email address');
//       setIsValid(false);
//       return false;
//     }

//     if (type === 'url' && text && !validator.isURL(text)) {
//       setErrorMessage('Please enter a valid URL');
//       setIsValid(false);
//       return false;
//     }

//     return true;
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     const value = e.target.value;
//     setInputValue(value);

//     // Analyze threats
//     const threatAnalysis = analyzeThreats(value);
//     const isSafe = threatAnalysis.threats.length === 0;

//     setSecurityStatus({
//       isSafe,
//       threats: threatAnalysis.threats,
//       riskLevel: threatAnalysis.riskLevel
//     });

//     // Sanitize if enabled
//     let processedValue = value;
//     if (sanitizeInput) {
//       processedValue = sanitizeText(value);
//       setSanitizedValue(processedValue);
//     }

//     // Validate
//     validateInput(processedValue);

//     // Trigger callbacks
//     onSecureChange({
//       original: value,
//       sanitized: processedValue,
//       isValid: validateInput(processedValue),
//       securityStatus: {
//         isSafe,
//         threats: threatAnalysis.threats,
//         riskLevel: threatAnalysis.riskLevel
//       }
//     });

//     // Alert if threats detected
//     if (!isSafe) {
//       onSecurityAlert({
//         threats: threatAnalysis.threats,
//         riskLevel: threatAnalysis.riskLevel,
//         input: value
//       });
//     }
//   };

//   // Get security indicator color
//   const getSecurityColor = () => {
//     if (!securityStatus.isSafe) {
//       return securityStatus.riskLevel === 'high' ? '#ff4757' : '#ffa502';
//     }
//     return '#2ed573';
//   };

//   // Get input class based on security status
//   const getInputClass = () => {
//     let baseClass = 'secure-input';
//     if (!isValid) baseClass += ' invalid';
//     if (!securityStatus.isSafe) {
//       baseClass += securityStatus.riskLevel === 'high' ? ' high-risk' : ' medium-risk';
//     } else {
//       baseClass += ' safe';
//     }
//     return baseClass;
//   };

//   const InputComponent = multiline ? 'textarea' : 'input';

//   return (
//     <div className="secure-text-input-container">
//       {label && (
//         <label className="secure-input-label">
//           {label}
//           {required && <span className="required">*</span>}
//         </label>
//       )}
      
//       <div className="input-wrapper">
//         <InputComponent
//           ref={inputRef}
//           type={multiline ? undefined : type}
//           rows={multiline ? rows : undefined}
//           className={getInputClass()}
//           placeholder={placeholder}
//           value={inputValue}
//           onChange={handleInputChange}
//           maxLength={maxLength}
//           disabled={disabled}
//           required={required}
//         />
        
//         {showSecurityStatus && (
//           <div className="security-indicator" style={{ backgroundColor: getSecurityColor() }}>
//             <span className="security-icon">
//               {securityStatus.isSafe ? '🛡️' : '⚠️'}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Character count */}
//       <div className="input-info">
//         <span className="char-count">
//           {inputValue.length}/{maxLength}
//         </span>
//         {sanitizeInput && sanitizedValue !== inputValue && (
//           <span className="sanitized-notice">
//             Input sanitized
//           </span>
//         )}
//       </div>

//       {/* Error message */}
//       {!isValid && errorMessage && (
//         <div className="error-message">
//           {errorMessage}
//         </div>
//       )}

//       {/* Security status */}
//       {showSecurityStatus && !securityStatus.isSafe && (
//         <div className="security-alerts">
//           <div className={`security-status ${securityStatus.riskLevel}-risk`}>
//             <strong>Security Alert ({securityStatus.riskLevel.toUpperCase()} RISK)</strong>
//             {securityStatus.threats.map((threat, index) => (
//               <div key={index} className="threat-item">
//                 <span className="threat-type">{threat.type}:</span>
//                 <span className="threat-description">{threat.description}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Sanitized preview */}
//       {sanitizeInput && sanitizedValue !== inputValue && (
//         <div className="sanitized-preview">
//           <strong>Sanitized output:</strong>
//           <div className="sanitized-text">{sanitizedValue}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SecureTextInput;

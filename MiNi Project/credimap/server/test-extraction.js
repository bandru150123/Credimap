const aiService = require('./services/aiService');

async function testExtraction() {
    console.log('Testing skill extraction with sample certificate text...\n');
    
    // Sample certificate texts for testing
    const testCases = [
        {
            name: "Data Analytics Certificate",
            text: "Certificate of Completion in Data Analytics. This certifies that John Doe has successfully completed training in Python, SQL, Excel, and Data Visualization. Skills learned include statistical analysis, data cleaning, and business intelligence."
        },
        {
            name: "Web Development Course",
            text: "Web Development Bootcamp Certificate. Proficient in HTML, CSS, JavaScript, React, and Node.js. Experience with MongoDB, Express.js, and REST API development. Completed projects using responsive design and modern frontend frameworks."
        },
        {
            name: "Cyber Security Certification",
            text: "Certified Ethical Hacker. Expertise in network security, penetration testing, vulnerability assessment, and security analysis. Knowledge of encryption, firewall configuration, and security protocols."
        },
        {
            name: "Cloud Computing Certificate",
            text: "AWS Certified Solutions Architect. Skills include cloud architecture, infrastructure as code, serverless computing, and DevOps practices. Experience with Docker, Kubernetes, Terraform, and CI/CD pipelines."
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n=== Testing: ${testCase.name} ===`);
        console.log(`Input text: ${testCase.text.substring(0, 100)}...`);
        
        try {
            const result = await aiService.extractSkillsFromText(testCase.text);
            console.log('Extracted Skills:', result.skills);
            console.log('Domains:', result.domains);
            console.log('Weights:', result.weights);
        } catch (error) {
            console.error('Error:', error.message);
        }
        
        console.log('---');
    }
}

testExtraction().catch(console.error);

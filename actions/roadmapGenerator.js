"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const roadmapGenerator = async (skill) => {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set in environment variables");
        console.error("Available env vars:", Object.keys(process.env).filter(key => key.includes('API')));
        throw new Error("API key not configured");
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const prompt = `
        Generate a React flow tree-structured learning roadmap for "${skill}" in the following format:

- Vertical tree structure with meaningful x/y positions to form a flow  
- Structure should be similar to roadmap.sh layout  
- Steps should be ordered from fundamentals to advanced  
- Include branching for different specializations (if applicable)  
- Each node must have a title, short description, and learning resource link  
- Use unique IDs for all nodes and edges  
- Make it more spacious in node positioning (minimum 200px vertical spacing)
- Ensure all required fields are present and properly formatted
- Response in JSON format  
{
  "roadmapTitle": "Learning Roadmap Title",
  "description": "3-5 line description of the learning path",
  "duration": "Estimated time to complete",
  "initialNodes": [
    {
      "id": "1",
      "type": "turbo",
      "position": { "x": 0, "y": 0 },
      "data": {
        "title": "Step Title",
        "description": "Short two-line explanation of what the step covers.",
        "link": "https://example.com/resource"
      }
    }
  ],
  "initialEdges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2",
      "type": "smoothstep",
      "animated": true
    }
  ]
}

IMPORTANT: 
- All node IDs must be strings
- All positions must be numbers
- All links must be valid URLs starting with https://
- Ensure consistent data structure
- No missing required fields
Please ensure the response is valid JSON format.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean the response text more thoroughly
        let cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        
        // Remove any leading/trailing whitespace and newlines
        cleanedText = cleanedText.replace(/^\s+|\s+$/g, '');
        
        // Parse JSON
        let roadmap;
        try {
            roadmap = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Raw text:", text);
            console.error("Cleaned text:", cleanedText);
            throw new Error("Invalid JSON response from AI");
        }
        
        // Strict validation and normalization
        const validatedRoadmap = validateAndNormalizeRoadmap(roadmap, skill);
        
        // Final structure validation
        if (!isValidRoadmapStructure(validatedRoadmap)) {
            throw new Error("Invalid roadmap structure after validation");
        }
        
        return validatedRoadmap;
        
    } catch (error) {
        console.error("Error generating roadmap:", error);
        console.error("Error details:", error.message);
        
        // Re-throw the error instead of returning fallback
        throw new Error(`Failed to generate roadmap for ${skill}: ${error.message}`);
    }
};

// Strict validation and normalization function
const validateAndNormalizeRoadmap = (roadmap, skill) => {
    // Validate basic structure
    if (!roadmap || typeof roadmap !== 'object') {
        throw new Error("Invalid roadmap object");
    }

    // Validate and normalize nodes
    const normalizedNodes = (roadmap.initialNodes || []).map((node, index) => {
        if (!node || typeof node !== 'object') {
            throw new Error(`Invalid node at index ${index}`);
        }

        return {
            id: String(node.id || `node-${index + 1}`),
            type: "turbo",
            position: {
                x: Number(node.position?.x || 0),
                y: Number(node.position?.y || index * 200)
            },
            data: {
                title: String(node.data?.title || `Step ${index + 1}`),
                description: String(node.data?.description || "Learning step description"),
                link: String(node.data?.link || "https://example.com").startsWith('http') 
                    ? String(node.data?.link || "https://example.com")
                    : "https://example.com"
            }
        };
    });

    // Validate and normalize edges
    const normalizedEdges = (roadmap.initialEdges || []).map((edge, index) => {
        if (!edge || typeof edge !== 'object') {
            throw new Error(`Invalid edge at index ${index}`);
        }

        return {
            id: String(edge.id || `edge-${index + 1}`),
            source: String(edge.source || `node-${index + 1}`),
            target: String(edge.target || `node-${index + 2}`),
            type: 'smoothstep',
            animated: true
        };
    });

    // Validate edge references
    const nodeIds = new Set(normalizedNodes.map(n => n.id));
    const validEdges = normalizedEdges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );

    return {
        roadmapTitle: String(roadmap.roadmapTitle || `${skill} Learning Roadmap`),
        description: String(roadmap.description || `A comprehensive learning path for ${skill}`),
        duration: String(roadmap.duration || "3-6 months"),
        initialNodes: normalizedNodes,
        initialEdges: validEdges
    };
};

// Structure validation function
const isValidRoadmapStructure = (roadmap) => {
    try {
        // Check required top-level properties
        const requiredProps = ['roadmapTitle', 'description', 'duration', 'initialNodes', 'initialEdges'];
        for (const prop of requiredProps) {
            if (!(prop in roadmap)) {
                console.error(`Missing required property: ${prop}`);
                return false;
            }
        }

        // Check nodes structure
        if (!Array.isArray(roadmap.initialNodes) || roadmap.initialNodes.length === 0) {
            console.error("Invalid or empty initialNodes array");
            return false;
        }

        // Validate each node
        for (const node of roadmap.initialNodes) {
            if (!node.id || !node.type || !node.position || !node.data) {
                console.error("Invalid node structure:", node);
                return false;
            }
            
            if (typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
                console.error("Invalid position coordinates:", node.position);
                return false;
            }
            
            if (!node.data.title || !node.data.description || !node.data.link) {
                console.error("Invalid node data:", node.data);
                return false;
            }
        }

        // Check edges structure
        if (!Array.isArray(roadmap.initialEdges)) {
            console.error("initialEdges is not an array");
            return false;
        }

        // Validate each edge
        for (const edge of roadmap.initialEdges) {
            if (!edge.id || !edge.source || !edge.target) {
                console.error("Invalid edge structure:", edge);
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error("Structure validation error:", error);
        return false;
    }
};

// Enhanced fallback roadmap - only use when explicitly needed
const getFallbackRoadmap = (skill) => {
    const steps = [
        { title: "Fundamentals", desc: `Learn the basics of ${skill}` },
        { title: "Core Concepts", desc: `Understanding key ${skill} concepts` },
        { title: "Basic Projects", desc: `Create simple ${skill} projects` },
        { title: "Intermediate Skills", desc: `Build intermediate ${skill} skills` },
        { title: "Advanced Topics", desc: `Master advanced ${skill} techniques` },
        { title: "Best Practices", desc: `Learn ${skill} best practices` },
        { title: "Real-world Applications", desc: `Apply ${skill} in real scenarios` },
        { title: "Expert Level", desc: `Become an expert in ${skill}` }
    ];

    const nodes = steps.map((step, index) => ({
        id: `node-${index + 1}`,
        type: "turbo",
        position: { x: 0, y: index * 200 },
        data: {
            title: step.title,
            description: step.desc,
            link: "https://example.com"
        }
    }));

    const edges = steps.slice(0, -1).map((_, index) => ({
        id: `edge-${index + 1}-${index + 2}`,
        source: `node-${index + 1}`,
        target: `node-${index + 2}`,
        type: 'smoothstep',
        animated: true
    }));

    return {
        roadmapTitle: `${skill} Learning Roadmap`,
        description: `A comprehensive learning path for getting started with ${skill}`,
        duration: "3-6 months",
        initialNodes: nodes,
        initialEdges: edges
    };
};
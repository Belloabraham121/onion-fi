import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

interface ProtocolData {
  name: string;
  contractAddress: string;
  totalDeposited: bigint;
  userCount: bigint;
  currentAPY: bigint;
  isActive: boolean;
  lastUpdated: bigint;
}

interface AIRecommendationRequest {
  amount: string;
  userPreferences?: {
    riskTolerance?: "low" | "medium" | "high";
    investmentDuration?: "short" | "medium" | "long";
    preferredProtocols?: string[];
  };
}

interface AIRecommendationResponse {
  protocolName: string;
  contractAddress: string;
  expectedYield: number;
  riskLevel: "low" | "medium" | "high";
  reasoning: string;
  confidence: number;
}

// Mock protocol data - in production, this would come from your smart contract
const mockProtocols: ProtocolData[] = [
  {
    name: "Aave",
    contractAddress: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    totalDeposited: BigInt("1000000000000000000000"), // 1000 tokens
    userCount: BigInt("150"),
    currentAPY: BigInt("580"), // 5.80%
    isActive: true,
    lastUpdated: BigInt(Date.now()),
  },
  {
    name: "Compound",
    contractAddress: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    totalDeposited: BigInt("800000000000000000000"), // 800 tokens
    userCount: BigInt("120"),
    currentAPY: BigInt("420"), // 4.20%
    isActive: true,
    lastUpdated: BigInt(Date.now()),
  },
  {
    name: "Yearn Finance",
    contractAddress: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    totalDeposited: BigInt("600000000000000000000"), // 600 tokens
    userCount: BigInt("80"),
    currentAPY: BigInt("750"), // 7.50%
    isActive: true,
    lastUpdated: BigInt(Date.now()),
  },
  {
    name: "Curve Finance",
    contractAddress: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    totalDeposited: BigInt("1200000000000000000000"), // 1200 tokens
    userCount: BigInt("200"),
    currentAPY: BigInt("650"), // 6.50%
    isActive: true,
    lastUpdated: BigInt(Date.now()),
  },
];

function formatProtocolsForAI(protocols: ProtocolData[]): string {
  return protocols
    .map((protocol) => {
      const apy = Number(protocol.currentAPY) / 100;
      const tvl = Number(protocol.totalDeposited) / 1e18;
      const users = Number(protocol.userCount);

      return `Protocol: ${protocol.name}
- APY: ${apy}%
- Total Value Locked: ${tvl.toFixed(2)} tokens
- Active Users: ${users}
- Contract: ${protocol.contractAddress}
- Status: ${protocol.isActive ? "Active" : "Inactive"}`;
    })
    .join("\n\n");
}

function determineRiskLevel(
  apy: number,
  tvl: number,
  users: number
): "low" | "medium" | "high" {
  // Higher APY generally means higher risk
  // Higher TVL and user count generally means lower risk
  const apyScore = apy > 8 ? 3 : apy > 5 ? 2 : 1;
  const tvlScore = tvl > 1000 ? 1 : tvl > 500 ? 2 : 3;
  const userScore = users > 150 ? 1 : users > 100 ? 2 : 3;

  const totalRisk = (apyScore + tvlScore + userScore) / 3;

  if (totalRisk <= 1.5) return "low";
  if (totalRisk <= 2.5) return "medium";
  return "high";
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRecommendationRequest = await request.json();
    const { amount, userPreferences = {} } = body;

    if (!amount || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid amount provided" },
        { status: 400 }
      );
    }

    // Format protocols data for AI analysis
    const protocolsData = formatProtocolsForAI(mockProtocols);
    const investmentAmount = parseFloat(amount) / 1e18; // Convert from wei to tokens

    // Create AI prompt
    const prompt = `
You are a DeFi investment advisor AI. Analyze the following protocols and recommend the best investment option.

Investment Details:
- Amount: ${investmentAmount.toFixed(6)} tokens
- Risk Tolerance: ${userPreferences.riskTolerance || "medium"}
- Investment Duration: ${userPreferences.investmentDuration || "medium"}
- Preferred Protocols: ${
      userPreferences.preferredProtocols?.join(", ") || "None specified"
    }

Available Protocols:
${protocolsData}

Please analyze these protocols considering:
1. APY (Annual Percentage Yield)
2. Total Value Locked (TVL) as a measure of protocol stability
3. Number of active users as a measure of trust
4. Risk vs reward ratio
5. User's risk tolerance and investment duration

Provide your recommendation in the following JSON format:
{
  "protocolName": "Protocol Name",
  "expectedYield": number (APY as percentage),
  "reasoning": "Detailed explanation of why this protocol is recommended",
  "confidence": number (0-100, confidence in recommendation)
}

Only return the JSON object, no additional text.
`;

    // Get AI recommendation
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Parse AI response
    let aiRecommendation;
    try {
      // Clean the response to extract JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response");
      }
      aiRecommendation = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      // Fallback to highest APY protocol
      const fallbackProtocol = mockProtocols.reduce((best, current) =>
        Number(current.currentAPY) > Number(best.currentAPY) ? current : best
      );
      aiRecommendation = {
        protocolName: fallbackProtocol.name,
        expectedYield: Number(fallbackProtocol.currentAPY) / 100,
        reasoning:
          "AI analysis failed, selected protocol with highest APY as fallback",
        confidence: 60,
      };
    }

    // Find the recommended protocol
    const recommendedProtocol = mockProtocols.find(
      (p) =>
        p.name.toLowerCase() === aiRecommendation.protocolName.toLowerCase()
    );

    if (!recommendedProtocol) {
      return NextResponse.json(
        { error: "Recommended protocol not found" },
        { status: 404 }
      );
    }

    // Calculate risk level
    const apy = Number(recommendedProtocol.currentAPY) / 100;
    const tvl = Number(recommendedProtocol.totalDeposited) / 1e18;
    const users = Number(recommendedProtocol.userCount);
    const riskLevel = determineRiskLevel(apy, tvl, users);

    const recommendation: AIRecommendationResponse = {
      protocolName: recommendedProtocol.name,
      contractAddress: recommendedProtocol.contractAddress,
      expectedYield: aiRecommendation.expectedYield,
      riskLevel,
      reasoning: aiRecommendation.reasoning,
      confidence: aiRecommendation.confidence,
    };

    return NextResponse.json(recommendation);
  } catch (error) {
    console.error("AI routing error:", error);

    // Fallback recommendation
    const fallbackProtocol = mockProtocols[0]; // Default to first protocol
    const fallbackRecommendation: AIRecommendationResponse = {
      protocolName: fallbackProtocol.name,
      contractAddress: fallbackProtocol.contractAddress,
      expectedYield: Number(fallbackProtocol.currentAPY) / 100,
      riskLevel: "medium",
      reasoning:
        "AI service temporarily unavailable, providing safe default recommendation",
      confidence: 50,
    };

    return NextResponse.json(fallbackRecommendation);
  }
}

// GET endpoint to fetch available protocols
export async function GET() {
  try {
    const protocols = mockProtocols.map((protocol) => ({
      name: protocol.name,
      contractAddress: protocol.contractAddress,
      apy: Number(protocol.currentAPY) / 100,
      tvl: Number(protocol.totalDeposited) / 1e18,
      users: Number(protocol.userCount),
      isActive: protocol.isActive,
      riskLevel: determineRiskLevel(
        Number(protocol.currentAPY) / 100,
        Number(protocol.totalDeposited) / 1e18,
        Number(protocol.userCount)
      ),
    }));

    return NextResponse.json({ protocols });
  } catch (error) {
    console.error("Error fetching protocols:", error);
    return NextResponse.json(
      { error: "Failed to fetch protocols" },
      { status: 500 }
    );
  }
}
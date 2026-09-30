// Realistic Hackathon Mock Data for JourneyAI
// AI-Powered Customer Journey Friction Detection & Recovery Assistant

export const MOCK_CUSTOMERS = [
  {
    id: "CUST-8492",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 234-8901",
    cartValue: 349.99,
    currency: "USD",
    device: "Mobile (iPhone 15 Pro - Safari)",
    location: "New York, USA",
    riskScore: 94,
    riskLevel: "HIGH",
    frictionType: "Payment Gateway Failure",
    frictionStage: "Payment",
    detectedAt: "3 mins ago",
    status: "Pending Recovery",
    evidence: {
      primaryFactor: "3DS Auth Timeout on Stripe Gateway",
      factors: [
        "2 consecutive payment retry failures (Error code: CARD_3DS_TIMEOUT)",
        "Dwell time on payment screen exceeded 420 seconds (avg: 45s)",
        "3 previous repeat visits to product page in 48 hours",
        "High purchase intent index (0.92/1.00) based on review interactions"
      ],
      impactScore: "Critical (-94% probability of recovery without intervention)"
    },
    journey: [
      {
        step: "Product View",
        title: "Sony WH-1000XM5 Wireless",
        status: "completed",
        timestamp: "10:14:02 AM",
        duration: "3m 12s",
        details: "Viewed tech specs, scrolled through 14 reviews, checked warranty options."
      },
      {
        step: "Comparison",
        title: "Bose QC Ultra vs Sony XM5",
        status: "completed",
        timestamp: "10:17:15 AM",
        duration: "4m 45s",
        details: "Used side-by-side spec comparison tool. Selected Sony for ANC score."
      },
      {
        step: "Add to Cart",
        title: "Cart Updated: $349.99",
        status: "completed",
        timestamp: "10:22:00 AM",
        duration: "45s",
        details: "Added 1x Silver edition with Free 2-Day Shipping selected."
      },
      {
        step: "Checkout",
        title: "Shipping & Contact Verified",
        status: "completed",
        timestamp: "10:22:45 AM",
        duration: "1m 10s",
        details: "Auto-filled delivery address (Manhattan, NY). Promo code not entered."
      },
      {
        step: "Payment",
        title: "Card Tokenization Failed",
        status: "friction",
        timestamp: "10:23:55 AM",
        duration: "7m 05s",
        details: "Friction point: 3D-Secure pop-up failed to load iframe on iOS Safari. User retried twice then closed tab."
      },
      {
        step: "Order/Abandonment",
        title: "Session Abandoned",
        status: "abandoned",
        timestamp: "10:31:00 AM",
        duration: "Now",
        details: "Customer exited without order confirmation. Recovery window active."
      }
    ],
    aiInsight: {
      likelyCause: "3D-Secure authentication iframe failed to respond on mobile Safari during Visa card verification.",
      explanation: "Alex demonstrated very high purchase intent with 7+ minutes of spec analysis and instant checkout progression. The abandonment was purely technical friction at the payment tokenization gate rather than price sensitivity.",
      recommendedRecovery: "Send an instant WhatsApp & Email with a 1-Click Alternate Payment Link (Apple Pay / PayPal Express) with 30-minute cart reservation.",
      personalizedMessage: "Hi Alex! We noticed your checkout for the Sony WH-1000XM5 was interrupted by a bank verification glitch. We've reserved your headphones for 30 minutes. Tap here for instant 1-Click Apple Pay / PayPal checkout: https://shop.demo/r/8492-pay",
      confidenceScore: 98,
      model: "Gemini 1.5 Pro / IntentGraph-v4",
      recoveryOptions: [
        {
          channel: "WhatsApp",
          action: "1-Click Apple Pay Link",
          urgency: "Immediate (< 5 min)"
        },
        {
          channel: "Email",
          action: "Assisted Payment Recovery",
          urgency: "Scheduled (+15 min)"
        }
      ]
    },
    recovery: {
      recommendedStrategy: "1-Click Alternative Payment Link (Apple Pay / PayPal)",
      channel: "WhatsApp + Email",
      discountOffer: "Free Express Shipping Upgrade",
      status: "Pending",
      history: []
    }
  },
  {
    id: "CUST-3910",
    name: "Elena Rostova",
    email: "elena.r@techcorp.io",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 789-1234",
    cartValue: 840.00,
    currency: "USD",
    device: "Desktop (macOS Chrome)",
    location: "San Francisco, USA",
    riskScore: 88,
    riskLevel: "HIGH",
    frictionType: "Shipping Cost Shock",
    frictionStage: "Checkout",
    detectedAt: "8 mins ago",
    status: "Pending Recovery",
    evidence: {
      primaryFactor: "Unexpected $65 International Oversize Duty added at Step 3",
      factors: [
        "Customer hovered on Shipping Line item for 48 seconds without moving",
        "Toggled between standard and express shipping 4 times",
        "Searched coupon aggregators (external tab switch detected)",
        "Cart size: 3 items ($840.00 total)"
      ],
      impactScore: "High (-88% likelihood to finalize without shipping incentive)"
    },
    journey: [
      {
        step: "Product View",
        title: "Ergonomic Standing Desk Pro",
        status: "completed",
        timestamp: "10:02:10 AM",
        duration: "5m 10s",
        details: "Explored wood finishes, dual-motor specs, and height presets."
      },
      {
        step: "Comparison",
        title: "Desk Accessories Bundle",
        status: "completed",
        timestamp: "10:07:20 AM",
        duration: "2m 30s",
        details: "Compared cable management kits and monitor arms."
      },
      {
        step: "Add to Cart",
        title: "3 Items Added ($840.00)",
        status: "completed",
        timestamp: "10:09:50 AM",
        duration: "1m 00s",
        details: "Added Desk, Ergonomic Mat, and Heavy-Duty Monitor Arm."
      },
      {
        step: "Checkout",
        title: "Shipping Fee Calculation Shock",
        status: "friction",
        timestamp: "10:10:50 AM",
        duration: "6m 15s",
        details: "Friction point: Heavy cargo surcharge added $65.00 shipping fee. User stalled on final amount confirmation."
      },
      {
        step: "Payment",
        title: "Payment Not Reached",
        status: "pending",
        timestamp: "-",
        duration: "-",
        details: "Customer did not enter billing or card details."
      },
      {
        step: "Order/Abandonment",
        title: "Session Idle - Cart Abandoned",
        status: "abandoned",
        timestamp: "10:17:05 AM",
        duration: "Now",
        details: "User left checkout tab open but inactive for >8 minutes."
      }
    ],
    aiInsight: {
      likelyCause: "Surprise freight shipping charge ($65) on high-value ergonomic furniture bundle exceeded buyer tolerance threshold.",
      explanation: "Elena is a high-value B2B buyer with an $840 order. The basket value qualifies for commercial discount tiers, but sudden shipping surcharge triggered price hesitation.",
      recommendedRecovery: "Trigger a dynamic 'Free White-Glove Shipping' waiver voucher (Code: FREESHIP840) via SMS/Email.",
      personalizedMessage: "Hi Elena! Complete your ergonomic workspace setup today and enjoy 100% Free Freight Shipping (saving you $65.00). Use code FREESHIP840 at checkout before midnight!",
      confidenceScore: 94,
      model: "Gemini 1.5 Pro / ElasticPricing-v1",
      recoveryOptions: [
        {
          channel: "Email",
          action: "100% Free Shipping Code",
          urgency: "Within 10 mins"
        },
        {
          channel: "In-App Banner",
          action: "Dynamic Cart Discount Bar",
          urgency: "Immediate"
        }
      ]
    },
    recovery: {
      recommendedStrategy: "Dynamic Free Shipping Code ($65 Value)",
      channel: "Email + SMS",
      discountOffer: "Code: FREESHIP840",
      status: "Pending",
      history: []
    }
  },
  {
    id: "CUST-5521",
    name: "Marcus Vance",
    email: "m.vance@gmail.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 432-6789",
    cartValue: 129.50,
    currency: "USD",
    device: "Mobile (Android - Chrome)",
    location: "Austin, TX, USA",
    riskScore: 82,
    riskLevel: "HIGH",
    frictionType: "Promo Code Invalid Error",
    frictionStage: "Checkout",
    detectedAt: "14 mins ago",
    status: "Pending Recovery",
    evidence: {
      primaryFactor: "3 Invalid promo code attempts (SAVE20, WELCOME10, INFLUENCER)",
      factors: [
        "User attempted 3 expired coupon codes in 90 seconds",
        "Rage-clicked 'Apply Coupon' button 5 times",
        "Dwell time in cart coupon input box: 3m 20s",
        "Cart value: $129.50"
      ],
      impactScore: "High (-82% completion rate after repeated coupon failure)"
    },
    journey: [
      {
        step: "Product View",
        title: "TrailRunner Pro GPS Smartwatch",
        status: "completed",
        timestamp: "09:45:10 AM",
        duration: "4m 10s",
        details: "Read battery life specs and heart rate sensor benchmarks."
      },
      {
        step: "Comparison",
        title: "Standard vs GPS Edition",
        status: "completed",
        timestamp: "09:49:20 AM",
        duration: "1m 40s",
        details: "Verified water resistance rating (50m)."
      },
      {
        step: "Add to Cart",
        title: "Cart Added ($129.50)",
        status: "completed",
        timestamp: "09:51:00 AM",
        duration: "30s",
        details: "Added Midnight Black color option."
      },
      {
        step: "Checkout",
        title: "Coupon Error Loop",
        status: "friction",
        timestamp: "09:51:30 AM",
        duration: "4m 20s",
        details: "Friction point: Tried 3 invalid influencer promo codes. Red error banner triggered rage clicks."
      },
      {
        step: "Payment",
        title: "Payment Bypassed",
        status: "pending",
        timestamp: "-",
        duration: "-",
        details: "Did not enter payment gateway."
      },
      {
        step: "Order/Abandonment",
        title: "Cart Abandoned",
        status: "abandoned",
        timestamp: "09:55:50 AM",
        duration: "Now",
        details: "User dropped off after third coupon rejection."
      }
    ],
    aiInsight: {
      likelyCause: "Customer arrived expecting a 15-20% coupon code and felt frustration when public codes failed.",
      explanation: "Marcus has demonstrated intent to buy the TrailRunner Pro. Coupon rejection creates negative sentiment and leads users to leave to hunt elsewhere on the web.",
      recommendedRecovery: "Auto-apply a valid personalized 10% First-Order Welcome discount (Code: WELCOME10-NOW) with instant checkout link.",
      personalizedMessage: "Hey Marcus, looks like your promo code didn't work! We've automatically activated an exclusive 10% discount for your TrailRunner Pro. Click here to checkout for just $116.55: https://shop.demo/r/5521-save",
      confidenceScore: 91,
      model: "Gemini 1.5 Pro / PromoAssistant-v3",
      recoveryOptions: [
        {
          channel: "SMS",
          action: "Direct 10% Auto-Applied Cart Link",
          urgency: "Immediate"
        }
      ]
    },
    recovery: {
      recommendedStrategy: "10% Auto-Applied Promo Link (Code: WELCOME10-NOW)",
      channel: "SMS + WhatsApp",
      discountOffer: "10% OFF ($12.95 savings)",
      status: "Pending",
      history: []
    }
  },
  {
    id: "CUST-6744",
    name: "Sophie Chen",
    email: "sophie.chen@designstudio.co",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 912-3456",
    cartValue: 560.00,
    currency: "USD",
    device: "Desktop (Windows 11 - Edge)",
    location: "Seattle, WA, USA",
    riskScore: 68,
    riskLevel: "MEDIUM",
    frictionType: "Comparison Paralysis",
    frictionStage: "Comparison",
    detectedAt: "22 mins ago",
    status: "Pending Recovery",
    evidence: {
      primaryFactor: "6 product switches between 4K Monitors with zero cart addition",
      factors: [
        "Toggled between 27-inch and 32-inch 4K displays 8 times in 15 minutes",
        "Opened 4 product tabs concurrently",
        "High dwell time (14 mins) on color calibration & USB-C power delivery specs",
        "Cart value: $0 (Paralyzed before Add to Cart)"
      ],
      impactScore: "Moderate (-68% drop-off risk due to decision fatigue)"
    },
    journey: [
      {
        step: "Product View",
        title: "ProArt 27-inch 4K HDR",
        status: "completed",
        timestamp: "09:20:10 AM",
        duration: "4m 15s",
        details: "Viewed DCI-P3 color gamut specs."
      },
      {
        step: "Comparison",
        title: "ProArt 27\" vs Dell UltraSharp 32\"",
        status: "friction",
        timestamp: "09:24:25 AM",
        duration: "14m 30s",
        details: "Friction point: Repeated tab switching, unable to decide between 27\" color fidelity vs 32\" screen real estate."
      },
      {
        step: "Add to Cart",
        title: "Add to Cart Not Reached",
        status: "pending",
        timestamp: "-",
        duration: "-",
        details: "Session stalled in comparison phase."
      },
      {
        step: "Checkout",
        title: "Not Reached",
        status: "pending",
        timestamp: "-",
        duration: "-",
        details: "-"
      },
      {
        step: "Payment",
        title: "Not Reached",
        status: "pending",
        timestamp: "-",
        duration: "-",
        details: "-"
      },
      {
        step: "Order/Abandonment",
        title: "Decision Fatigue Bounce",
        status: "abandoned",
        timestamp: "09:38:55 AM",
        duration: "Now",
        details: "Left without committing to either item."
      }
    ],
    aiInsight: {
      likelyCause: "Analysis paralysis between two closely matched 4K monitor SKUs for professional graphic design.",
      explanation: "Sophie spent over 14 minutes comparing refresh rates and USB-C wattage. She requires a concise expert verdict or interactive buyer guide to resolve ambiguity.",
      recommendedRecovery: "Send an AI-generated 60-second Buying Recommendation comparing the 2 models tailored for macOS design setups with a $30 monitor arm bundle discount.",
      personalizedMessage: "Hi Sophie! Still deciding between the 27\" and 32\" 4K monitors? For creative studio work, the 27\" ProArt provides 100% Rec.709 color accuracy with better pixel density. Here's a 1-minute breakdown plus $30 off: https://shop.demo/guide/sophie",
      confidenceScore: 89,
      model: "Gemini 1.5 Pro / DecisionGuide-v2",
      recoveryOptions: [
        {
          channel: "Email",
          action: "AI Buyer Guide & Side-by-Side Verdict",
          urgency: "Within 30 mins"
        }
      ]
    },
    recovery: {
      recommendedStrategy: "AI Buyer Guide & $30 Bundle Credit",
      channel: "Email",
      discountOffer: "$30 Studio Bundle Credit",
      status: "Pending",
      history: []
    }
  },
  {
    id: "CUST-4189",
    name: "Devon Brooks",
    email: "d.brooks@enterprise.net",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 654-9870",
    cartValue: 215.00,
    currency: "USD",
    device: "Mobile (Pixel 8 - Chrome)",
    location: "Chicago, IL, USA",
    riskScore: 54,
    riskLevel: "MEDIUM",
    frictionType: "Address Auto-Complete Error",
    frictionStage: "Checkout",
    detectedAt: "35 mins ago",
    status: "Pending Recovery",
    evidence: {
      primaryFactor: "Google Places address API timeout on mobile browser",
      factors: [
        "Zip code auto-complete stalled on apartment unit input",
        "Form validation triggered 'Invalid Postal Code' twice",
        "Customer attempted manual correction 2 times",
        "Cart Value: $215.00"
      ],
      impactScore: "Moderate (-54% completion chance due to checkout form frustration)"
    },
    journey: [
      {
        step: "Product View",
        title: "All-Weather Hiking Boots (Size 10.5)",
        status: "completed",
        timestamp: "08:50:00 AM",
        duration: "2m 10s",
        details: "Verified waterproof Gore-Tex rating and sizing guide."
      },
      {
        step: "Comparison",
        title: "Mid vs High Ankle Cut",
        status: "completed",
        timestamp: "08:52:10 AM",
        duration: "1m 15s",
        details: "Selected Mid Ankle Cut (Brown)."
      },
      {
        step: "Add to Cart",
        title: "Added to Cart ($215.00)",
        status: "completed",
        timestamp: "08:53:25 AM",
        duration: "20s",
        details: "Selected standard shipping."
      },
      {
        step: "Checkout",
        title: "Address Form Stalled",
        status: "friction",
        timestamp: "08:53:45 AM",
        duration: "3m 40s",
        details: "Friction point: Suite number address validation threw generic error on mobile viewport."
      },
      {
        step: "Payment",
        title: "Not Reached",
        status: "pending",
        timestamp: "-",
        duration: "-",
        details: "-"
      },
      {
        step: "Order/Abandonment",
        title: "Abandoned at Shipping Form",
        status: "abandoned",
        timestamp: "08:57:25 AM",
        duration: "Now",
        details: "Session closed after repeated form validation error."
      }
    ],
    aiInsight: {
      likelyCause: "Mobile browser address auto-fill failed to parse secondary unit/apt number properly.",
      explanation: "Devon was ready to purchase immediately. A simple 1-click verified address checkout link via SMS will resolve the form blocker instantly.",
      recommendedRecovery: "Send SMS with pre-validated address link allowing 1-tap checkout.",
      personalizedMessage: "Hi Devon, we noticed an issue saving your shipping address for the Hiking Boots. We've simplified checkout for you—tap here to confirm your address and complete your order: https://shop.demo/r/4189-fast",
      confidenceScore: 92,
      model: "Gemini 1.5 Pro / FormFix-v1",
      recoveryOptions: [
        {
          channel: "SMS",
          action: "Pre-filled Express Link",
          urgency: "Immediate"
        }
      ]
    },
    recovery: {
      recommendedStrategy: "Pre-filled Address Instant Checkout Link",
      channel: "SMS",
      discountOffer: "Free 1-Day Shipping",
      status: "Pending",
      history: []
    }
  },
  {
    id: "CUST-9023",
    name: "Maya Patel",
    email: "maya.patel@gmail.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 876-5432",
    cartValue: 78.00,
    currency: "USD",
    device: "Desktop (Mac Safari)",
    location: "Toronto, Canada",
    riskScore: 24,
    riskLevel: "LOW",
    frictionType: "Minor Delivery Estimate Query",
    frictionStage: "Product View",
    detectedAt: "48 mins ago",
    status: "Monitoring",
    evidence: {
      primaryFactor: "Checked international shipping policy modal",
      factors: [
        "Browsed 4 items in skincare category",
        "Opened FAQ about customs clearance to Canada",
        "Session active within standard shopping velocity",
        "Cart value: $78.00"
      ],
      impactScore: "Low (Normal shopping behavior, low abandonment risk)"
    },
    journey: [
      {
        step: "Product View",
        title: "Hydration Serum + Night Cream",
        status: "completed",
        timestamp: "08:10:00 AM",
        duration: "3m 00s",
        details: "Explored active ingredients and organic certifications."
      },
      {
        step: "Comparison",
        title: "Standard vs Jumbo Size",
        status: "completed",
        timestamp: "08:13:00 AM",
        duration: "1m 30s",
        details: "Selected 50ml standard size."
      },
      {
        step: "Add to Cart",
        title: "Cart Updated: $78.00",
        status: "completed",
        timestamp: "08:14:30 AM",
        duration: "45s",
        details: "Cart active."
      },
      {
        step: "Checkout",
        title: "Shipping Options Viewed",
        status: "completed",
        timestamp: "08:15:15 AM",
        duration: "1m 20s",
        details: "Checked estimated arrival (3 business days)."
      },
      {
        step: "Payment",
        title: "In Progress / Low Risk",
        status: "completed",
        timestamp: "08:16:35 AM",
        duration: "Ongoing",
        details: "Standard checkout flow."
      },
      {
        step: "Order/Abandonment",
        title: "Order Processing",
        status: "completed",
        timestamp: "08:17:10 AM",
        duration: "Done",
        details: "Low risk profile."
      }
    ],
    aiInsight: {
      likelyCause: "Routine customer journey with minor inquiry on Canadian customs duty threshold.",
      explanation: "Maya is progressing smoothly through the standard funnel. Automated recovery is not required at this time.",
      recommendedRecovery: "Passive reassurance tooltip on free returns and guaranteed no-duty delivery for Canada.",
      personalizedMessage: "Thanks for shopping with us, Maya! All orders to Canada include pre-paid customs & 30-day free returns.",
      confidenceScore: 97,
      model: "Gemini 1.5 Pro / FunnelHealth-v2",
      recoveryOptions: []
    },
    recovery: {
      recommendedStrategy: "Passive Tracking (No intervention required)",
      channel: "In-App Tooltip",
      discountOffer: "None",
      status: "Healthy",
      history: []
    }
  },
  {
    id: "CUST-1823",
    name: "Liam O'Connor",
    email: "liam.oc@outlook.com",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    phone: "+1 (555) 345-6712",
    cartValue: 420.00,
    currency: "USD",
    device: "Desktop (Windows 11 - Firefox)",
    location: "Dublin, Ireland",
    riskScore: 19,
    riskLevel: "LOW",
    frictionType: "None (Healthy Flow)",
    frictionStage: "Order/Abandonment",
    detectedAt: "1 hour ago",
    status: "Converted",
    evidence: {
      primaryFactor: "Zero blockers detected. Smooth 4m 12s completion flow.",
      factors: [
        "Direct checkout flow with saved payment method",
        "Standard browsing pace",
        "High loyalty tier customer (Gold Member)"
      ],
      impactScore: "Low (Completed order)"
    },
    journey: [
      {
        step: "Product View",
        title: "Mechanical Keyboard Custom Kit",
        status: "completed",
        timestamp: "07:30:00 AM",
        duration: "1m 30s",
        details: "Direct arrival from newsletter."
      },
      {
        step: "Comparison",
        title: "Switch Types (Linear vs Tactile)",
        status: "completed",
        timestamp: "07:31:30 AM",
        duration: "45s",
        details: "Selected Gateron Oil Kings."
      },
      {
        step: "Add to Cart",
        title: "Cart Updated: $420.00",
        status: "completed",
        timestamp: "07:32:15 AM",
        duration: "15s",
        details: "Added keyboard + switch pack."
      },
      {
        step: "Checkout",
        title: "1-Click Checkout",
        status: "completed",
        timestamp: "07:32:30 AM",
        duration: "30s",
        details: "Saved address auto-selected."
      },
      {
        step: "Payment",
        title: "Payment Approved ($420.00)",
        status: "completed",
        timestamp: "07:33:00 AM",
        duration: "12s",
        details: "Visa tokenized successfully."
      },
      {
        step: "Order/Abandonment",
        title: "Order Confirmed #ORD-9912",
        status: "completed",
        timestamp: "07:33:12 AM",
        duration: "Done",
        details: "Confirmation email sent."
      }
    ],
    aiInsight: {
      likelyCause: "Frictionless checkout experience with pre-saved credentials.",
      explanation: "Liam completed the entire purchase lifecycle in under 4 minutes with zero friction events.",
      recommendedRecovery: "None needed. Send standard VIP loyalty points confirmation.",
      personalizedMessage: "Your order is confirmed, Liam! You earned 420 VIP points on this order.",
      confidenceScore: 99,
      model: "Gemini 1.5 Pro / LoyaltyTracker",
      recoveryOptions: []
    },
    recovery: {
      recommendedStrategy: "Completed - No Action Required",
      channel: "Email Receipt",
      discountOffer: "None",
      status: "Converted",
      history: []
    }
  }
];

// Aggregated Summary Analytics
export const MOCK_RISK_ANALYTICS = {
  totalCustomers: 1248,
  highRiskCustomers: 142,
  frictionsDetected: 189,
  recoverableCustomers: 118,
  estimatedRecoverableRevenue: "$46,850",
  averageRecoveryRate: "68.4%",
  riskDistribution: [
    { name: "High Risk", count: 142, percentage: 11.4, color: "#EF4444" },
    { name: "Medium Risk", count: 286, percentage: 22.9, color: "#F59E0B" },
    { name: "Low Risk", count: 820, percentage: 65.7, color: "#10B981" }
  ],
  frictionTypes: [
    { type: "Payment Gateway Failure", count: 68, highRiskCount: 52, percentage: 36.0, color: "#EF4444" },
    { type: "Shipping Cost Shock", count: 47, highRiskCount: 38, percentage: 24.9, color: "#F97316" },
    { type: "Promo Code Invalid Error", count: 35, highRiskCount: 26, percentage: 18.5, color: "#F59E0B" },
    { type: "Comparison Paralysis", count: 24, highRiskCount: 16, percentage: 12.7, color: "#8B5CF6" },
    { type: "Form Validation Error", count: 15, highRiskCount: 10, percentage: 7.9, color: "#06B6D4" }
  ],
  funnelDropoffs: [
    { stage: "Product View", visitors: 1248, dropoff: 0, conversionRate: "100%" },
    { stage: "Comparison", visitors: 980, dropoff: 268, conversionRate: "78.5%" },
    { stage: "Add to Cart", visitors: 640, dropoff: 340, conversionRate: "51.3%" },
    { stage: "Checkout", visitors: 420, dropoff: 220, conversionRate: "33.6%" },
    { stage: "Payment", visitors: 280, dropoff: 140, conversionRate: "22.4%" },
    { stage: "Order Placed", visitors: 195, dropoff: 85, conversionRate: "15.6%" }
  ]
};

export const MOCK_RECOVERY_LOGS = [
  {
    id: "REC-101",
    customerId: "CUST-8492",
    customerName: "Alex Rivera",
    strategy: "1-Click Alternative Payment Link",
    channel: "WhatsApp",
    triggeredAt: "10:35:12 AM",
    status: "Delivered",
    revenueProtected: "$349.99"
  },
  {
    id: "REC-102",
    customerId: "CUST-3910",
    customerName: "Elena Rostova",
    strategy: "Dynamic Free Shipping Code ($65)",
    channel: "Email",
    triggeredAt: "10:20:00 AM",
    status: "Converted",
    revenueProtected: "$840.00"
  },
  {
    id: "REC-103",
    customerId: "CUST-5521",
    customerName: "Marcus Vance",
    strategy: "10% Auto-Applied Promo Link",
    channel: "SMS",
    triggeredAt: "09:58:45 AM",
    status: "Delivered",
    revenueProtected: "$116.55"
  }
];

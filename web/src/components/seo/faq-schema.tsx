interface FAQItem {
  question: string;
  questionTh?: string;
  answer: string;
  answerTh?: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
  lang?: string;
}

export function FAQSchema({ faqs, lang = "en" }: FAQSchemaProps) {
  const isThai = lang === "th";

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: isThai && faq.questionTh ? faq.questionTh : faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: isThai && faq.answerTh ? faq.answerTh : faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Pre-defined insurance FAQs for use across the site
export const insuranceFAQs: FAQItem[] = [
  {
    question: "What types of insurance does InsureAI compare?",
    questionTh: "InsureAI เปรียบเทียบประกันประเภทใดบ้าง?",
    answer:
      "InsureAI compares health insurance, life insurance, critical illness insurance, savings insurance, and pension plans from leading Thai insurers.",
    answerTh:
      "InsureAI เปรียบเทียบประกันสุขภาพ ประกันชีวิต ประกันโรคร้ายแรง ประกันออมทรัพย์ และแผนบำนาญจากบริษัทประกันชั้นนำในประเทศไทย",
  },
  {
    question: "How does AI insurance recommendation work?",
    questionTh: "ระบบ AI แนะนำประกันทำงานอย่างไร?",
    answer:
      "Our AI analyzes your age, health status, budget, and coverage needs to recommend personalized insurance plans that match your requirements.",
    answerTh:
      "AI ของเราวิเคราะห์อายุ สถานะสุขภาพ งบประมาณ และความต้องการความคุ้มครอง เพื่อแนะนำแผนประกันที่เหมาะสมกับคุณ",
  },
  {
    question: "Is InsureAI free to use?",
    questionTh: "InsureAI ใช้งานฟรีหรือไม่?",
    answer:
      "Yes, InsureAI is completely free to use. We help you compare and find the best insurance plans without any charges.",
    answerTh:
      "ใช่ InsureAI ใช้งานได้ฟรีทั้งหมด เราช่วยคุณเปรียบเทียบและค้นหาแผนประกันที่ดีที่สุดโดยไม่มีค่าใช้จ่าย",
  },
  {
    question: "Can I buy insurance directly through InsureAI?",
    questionTh: "สามารถซื้อประกันผ่าน InsureAI ได้เลยหรือไม่?",
    answer:
      "InsureAI helps you compare and understand insurance plans. For purchasing, we connect you directly with the insurance company or their authorized agents.",
    answerTh:
      "InsureAI ช่วยคุณเปรียบเทียบและเข้าใจแผนประกัน สำหรับการซื้อ เราจะเชื่อมต่อคุณกับบริษัทประกันหรือตัวแทนโดยตรง",
  },
  {
    question: "How long does it take to get insurance recommendations?",
    questionTh: "ใช้เวลานานเท่าไหร่ในการรับคำแนะนำประกัน?",
    answer:
      "You can get personalized insurance recommendations in just 60 seconds by answering a few simple questions about your needs.",
    answerTh:
      "คุณสามารถรับคำแนะนำประกันที่เหมาะกับคุณได้ภายใน 60 วินาที โดยตอบคำถามง่ายๆ ไม่กี่ข้อ",
  },
];

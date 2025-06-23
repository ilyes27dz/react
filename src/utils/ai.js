// دالة اقتراح نوع البلاغ (موجودة لديك)
export async function suggestReportType(description) {
  const GEMINI_API_KEY = "AIzaSyA-caJVhtUPRidfCTYvqAMDvQNPWFLKXh4";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `حدد نوع البلاغ التالي من بين (حريق، إسعاف، حادث مرور، غرق، فقدان شخص، تهديد، بلاغ آخر) فقط: "${description}". أجب بكلمة واحدة فقط.`
          }]
        }]
      }),
    }
  );
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

// دالة الدردشة الذكية
export async function getAIReply(text) {
  const GEMINI_API_KEY = "AIzaSyA-caJVhtUPRidfCTYvqAMDvQNPWFLKXh4";
  const prompt = `
أنت موظف خدمة عملاء رسمي في مركز البلاغات الوطني.
- إذا كان سؤال المواطن عن **طريقة التبليغ**، اشرح له الخطوات اللازمة بالتفصيل (مثال: الدخول للمنصة، اختيار نوع البلاغ، تعبئة البيانات، إرسال البلاغ).
- إذا كان السؤال عن **الجهة المسؤولة عن دائرة أو خدمة**، وضّح اسم الجهة الرسمية، وإذا لم يكن لديك معلومات واضحة اطلب من المواطن تفاصيل إضافية (مثل اسم الدائرة أو الموقع).
- إذا كان السؤال استفسار عام، أجب باحترافية ووضوح وبأسلوب رسمي مختصر.
- إذا لم تفهم السؤال اطلب توضيح من المواطن.

سؤال المواطن:
"${text}"
`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    }
  );
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "عذراً، لم أتمكن من فهم سؤالك. يرجى توضيح الاستفسار أكثر.";
}

// 1. توليد رسالة شكر أو اعتذار رسمية تلقائية
export async function generateThanksOrApology(type = "thanks", reason = "") {
  const GEMINI_API_KEY = "AIzaSyA-caJVhtUPRidfCTYvqAMDvQNPWFLKXh4";
  let prompt = "";
  if (type === "thanks") {
    prompt = `اكتب رسالة شكر رسمية قصيرة لمواطن قدم بلاغًا. ${reason ? "سبب الشكر: " + reason : ""}`;
  } else {
    prompt = `اكتب رسالة اعتذار رسمية قصيرة لمواطن بسبب: ${reason}`;
  }
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    }
  );
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}

// 2. كشف الرسائل غير اللائقة أو السبام
export async function isSpamOrInappropriate(text) {
  const GEMINI_API_KEY = "AIzaSyA-caJVhtUPRidfCTYvqAMDvQNPWFLKXh4";
  const prompt = `
افحص النص التالي وأجب فقط بكلمة واحدة (نعم أو لا): 
هل يحتوي النص على إساءة أو ألفاظ غير لائقة أو سبام؟ 
النص: "${text}"
أجب فقط: نعم أو لا.
`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    }
  );
  const data = await response.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return answer && answer.startsWith("نعم");
}

// 3. اقتراح حلول أو إجراءات تلقائية
export async function suggestActionsOrSolutions(text) {
  const GEMINI_API_KEY = "AIzaSyA-caJVhtUPRidfCTYvqAMDvQNPWFLKXh4";
  const prompt = `
اقرأ البلاغ التالي واقترح عليه 3 حلول أو إجراءات رسمية ممكن اتخاذها من قبل الجهة المختصة. 
اكتب كل إجراء في سطر منفصل بدون شرح طويل.
النص: "${text}"
`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    }
  );
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
}
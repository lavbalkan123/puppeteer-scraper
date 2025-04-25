function sendSteelBiteEmails() {
  var files = DriveApp.getFilesByName('recipients.txt');
  if (!files.hasNext()) {
    Logger.log("recipients.txt not found.");
    return;
  }

  var file = files.next();
  var recipients = file.getBlob().getDataAsString().split("\n").map(r => r.trim()).filter(String);
  var scriptProperties = PropertiesService.getScriptProperties();

  var lastIndex = parseInt(scriptProperties.getProperty('lastIndex')) || 0;

  // Postavi startDate ako nije postavljen
  var startDate = scriptProperties.getProperty('startDate');
  if (!startDate) {
    startDate = new Date().toISOString();
    scriptProperties.setProperty('startDate', startDate);
  }

  var now = new Date();
  var start = new Date(startDate);
  var daysElapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));

  var emailsToSend = 1;
  var delayBetweenEmails = 0;

  // Računanje ukupnih sati od početka
  var totalHoursSinceStart = Math.floor((now - start) / (1000 * 60 * 60));

  // Logika za intervale slanja e-mailova
  if (daysElapsed <= 14) {
    // Prvih 15 dana: 1 email svakih 2 sata
    if (totalHoursSinceStart % 2 !== 0) {
      Logger.log("Skipping this hour to maintain 2-hour interval.");
      return;  // Preskoči slanje u ovom satu
    }
    emailsToSend = 1;
  } else if (daysElapsed <= 29) {
    // 15-30 dana: 1 email po satu
    emailsToSend = 1;
  } else if (daysElapsed <= 44) {
    // 31-45 dana: 2 emaila po satu
    emailsToSend = 2;
    delayBetweenEmails = 25; // pauza između slanja
  } else {
    // Nakon 45 dana: 3 emaila po satu
    emailsToSend = 3;
    delayBetweenEmails = 25; // pauza između slanja
  }

  // Slanje emailova
  for (var i = 0; i < emailsToSend; i++) {
    if (lastIndex >= recipients.length) {
      lastIndex = 0; // restart liste ako dođe do kraja
    }

    var recipient = recipients[lastIndex];
    if (!recipient.includes("@")) {
      Logger.log("Invalid email format: " + recipient);
      lastIndex++;
      continue;
    }

    var subject = generateSubject();
    var body = generateEmailBody();

    try {
      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        body: body,
        name: "Steel Bite Pro™"
      });
      Logger.log("Email sent to: " + recipient);
    } catch (error) {
      Logger.log("Error sending email to " + recipient + ": " + error.message);
    }

    lastIndex++;

    // Pauza između slanja emailova (ako šaljemo više od jednog)
    if (delayBetweenEmails > 0 && i < emailsToSend - 1) {
      Utilities.sleep(delayBetweenEmails * 1000); // Pauza u sekundama
    }
  }

  scriptProperties.setProperty('lastIndex', lastIndex);  // Sprema poziciju u listi za sledeće slanje
}


// Generiše nasumičan subject za email
function generateSubject() {
  var options = [
    "STEEL BITE PRO™  – ADVANCED SUPPORT FOR ORAL WELLNESS",
    "STEEL BITE PRO™  – NATURAL DEFENSE FOR GUMS & TEETH",
    "STEEL BITE PRO™  – BUILT FOR LONG-TERM ORAL CARE",
    "STEEL BITE PRO™  – TRUSTED SUPPLEMENT FOR DENTAL HEALTH",
    "STEEL BITE PRO™  – DAILY SUPPORT FOR STRONG TEETH"
  ];
  return options[Math.floor(Math.random() * options.length)];
}


// Generiše tijelo poruke
function generateEmailBody() {
  var greetings = [
    "I hope this message finds you well.",
    "Trust you're having a productive day.",
    "Hope all is going smoothly at your practice.",
    "Sending this with your patients’ wellbeing in mind.",
    "Reaching out with something valuable for your clinic."
  ];
  var greeting = greetings[Math.floor(Math.random() * greetings.length)];

  var variationSets = [
    {
      line: "Developed to SUPPORT GUM HEALTH, PREVENT DECAY, and FRESHEN BREATH — from within.",
      benefits: [
        "• STRENGTHENS gum structure and tooth foundation",
        "• NEUTRALIZES harmful oral bacteria naturally",
        "• SUPPORTS long-term balance and protection"
      ]
    },
    {
      line: "Designed to target the ROOT CAUSES of common dental issues — not just the symptoms.",
      benefits: [
        "• REDUCES inflammation and plaque buildup",
        "• DEFENDS enamel without harsh chemicals",
        "• ENCOURAGES daily comfort and hygiene"
      ]
    },
    {
      line: "A plant-based formula for COMPLETE ORAL DEFENSE and TOTAL MOUTH HEALTH.",
      benefits: [
        "• MAINTAINS optimal oral pH",
        "• FRESHENS breath and reduces tartar",
        "• REINFORCES enamel with natural compounds"
      ]
    }
  ];

  var set = variationSets[Math.floor(Math.random() * variationSets.length)];

  return `Hi Dentals,

${greeting}

I’m introducing STEEL BITE PRO™ — a 100% NATURAL supplement created to provide INTERNAL, DAILY SUPPORT for oral wellness, helping to maintain healthy teeth and gums.

STEEL BITE PRO™ is:  
• MADE IN THE USA  
• FDA REGISTERED  
• GMP CERTIFIED  
• NON-GMO

${set.line}

Key benefits include:  
${set.benefits[0]}  
${set.benefits[1]}  
${set.benefits[2]}

Clinics across the U.S. are recommending this supplement to patients who seek a GENTLER alternative to aggressive dental procedures.

We also offer a money-back guarantee – if you or your patients aren't fully satisfied, we’ll refund the full amount, no questions asked.

You can find us on TikTok as Steel Bite Pro™, where we regularly share oral health tips, user reviews, and results.

For more information, visit:  
STEELBITEPROINC.COM

Best regards,  
Your Dental Partner  
Steel Bite Pro™ Team`;
}

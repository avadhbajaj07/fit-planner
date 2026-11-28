export function getWelcomePlanEmailHtml({
  athleteName,
  goal,
  split,
  daysPerWeek,
  dailyCalories,
  proteinGrams,
  dashboardUrl
}: {
  athleteName?: string;
  goal: string;
  split: string;
  daysPerWeek: number;
  dailyCalories?: number;
  proteinGrams?: number;
  dashboardUrl: string;
}) {
  const name = athleteName || "Athlete";
  const formattedGoal = goal.replace(/_/g, " ").toUpperCase();
  const formattedSplit = split.replace(/_/g, " ").toUpperCase();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Personalized Shape Radar Periodization Plan</title>
</head>
<body style="background-color: #07151D; color: #F4F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 30px 15px;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #0E242C; border: 1px solid #28525B; border-radius: 20px; overflow: hidden;">
    <div style="padding: 30px; text-align: center; border-bottom: 1px solid #28525B;">
      <h1 style="color: #28DACC; font-size: 24px; margin: 0; letter-spacing: 2px;">SHAPE RADAR</h1>
      <p style="color: #A8C5CA; font-size: 13px; margin: 8px 0 0;">CLINICAL PERIODIZATION & EUROPEAN NUTRITION</p>
    </div>
    
    <div style="padding: 30px;">
      <h2 style="font-size: 20px; color: #F4F9FA; margin-top: 0;">Welcome, ${name}</h2>
      <p style="color: #A8C5CA; font-size: 14px; line-height: 1.6;">
        Your scientific 12-week progressive overload plan is now generated and synchronized with your account.
      </p>

      <div style="background-color: #07151D; border: 1px solid #28525B; border-radius: 14px; padding: 20px; margin: 25px 0;">
        <h3 style="color: #28DACC; font-size: 14px; text-transform: uppercase; margin: 0 0 15px; letter-spacing: 1px;">Training Blueprint</h3>
        <p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Primary Target:</strong> ${formattedGoal}</p>
        <p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Training Split:</strong> ${formattedSplit}</p>
        <p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Weekly Frequency:</strong> ${daysPerWeek} Days / Week</p>
        ${dailyCalories ? `<p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Caloric Target:</strong> ~${dailyCalories} kcal / day</p>` : ""}
        ${proteinGrams ? `<p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Optimal Protein:</strong> ~${proteinGrams}g / day</p>` : ""}
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="background-color: #28DACC; color: #07151D; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; display: inline-block;">
          Open Today's Workout &rarr;
        </a>
      </div>

      <p style="color: #A8C5CA; font-size: 12px; line-height: 1.5; border-top: 1px solid #28525B; padding-top: 20px; margin-top: 30px;">
        Double Progression Notice: Shape Radar automatically increments your loads when rep ceilings are achieved with clean form. You can adjust exercises in the mobile app.
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

export function getSubscriptionReceiptEmailHtml({
  athleteEmail,
  planTitle,
  amountFormatted,
  currentPeriodEnd,
  dashboardUrl
}: {
  athleteEmail: string;
  planTitle: string;
  amountFormatted: string;
  currentPeriodEnd: string;
  dashboardUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Shape Radar Membership Confirmation</title>
</head>
<body style="background-color: #07151D; color: #F4F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 30px 15px;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #0E242C; border: 1px solid #28525B; border-radius: 20px; overflow: hidden;">
    <div style="padding: 30px; text-align: center; border-bottom: 1px solid #28525B;">
      <h1 style="color: #28DACC; font-size: 24px; margin: 0; letter-spacing: 2px;">SHAPE RADAR</h1>
      <p style="color: #A8C5CA; font-size: 13px; margin: 8px 0 0;">MEMBERSHIP RECEIPT & GUARANTEE TERMS</p>
    </div>
    
    <div style="padding: 30px;">
      <h2 style="font-size: 18px; color: #F4F9FA; margin-top: 0;">Payment Confirmation</h2>
      <p style="color: #A8C5CA; font-size: 14px; line-height: 1.6;">
        Thank you for choosing Shape Radar. Your PRO access has been unlocked across all devices.
      </p>

      <div style="background-color: #07151D; border: 1px solid #28525B; border-radius: 14px; padding: 20px; margin: 20px 0;">
        <p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Plan:</strong> ${planTitle}</p>
        <p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Account:</strong> ${athleteEmail}</p>
        <p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Amount Paid:</strong> ${amountFormatted}</p>
        <p style="margin: 6px 0; font-size: 13px; color: #F4F9FA;"><strong>Current Period Through:</strong> ${currentPeriodEnd}</p>
      </div>

      <div style="background-color: #102831; border: 1px solid #28DACC/30; border-radius: 14px; padding: 15px; margin: 20px 0;">
        <h4 style="color: #28DACC; margin: 0 0 6px; font-size: 13px;">30-Day 100% Money-Back Guarantee</h4>
        <p style="color: #A8C5CA; font-size: 12px; margin: 0; line-height: 1.5;">
          If for any reason Shape Radar does not elevate your training, contact support@shaperadar.app within 30 days for an immediate 100% refund.
        </p>
      </div>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${dashboardUrl}" style="background-color: #28DACC; color: #07151D; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 10px; display: inline-block;">
          Go to Your Portal &rarr;
        </a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

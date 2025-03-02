export async function notify(message: string, success: true | false, meta?: string, logs?: string) {
    const webhookURL = 'https://discordapp.com/api/webhooks/1341144112967188633/jVMmCd5FXdkZUgkuLQyVY1LIzkm35uMwUuMFpOAC_DDaJU-Bx7T9a0VnGxJZiUR2puXQ';
    
    // Ensure logs is a string, or set it to an empty string if not provided
    const logCodeBlock = logs ? `\`\`\`\n${logs}\n\`\`\`` : '';
  
    const fields: Array<{ name: string, value: string, inline: boolean }> = [
      {
        name: "Status",
        value: success ? "Success" : "Failure",
        inline: false,
      }
    ];
  
    if (meta) {
      fields.push({
        name: "Meta",
        value: meta,
        inline: false,
      });
    }
    
    // Only add logs field if logs are provided
    if (logCodeBlock) {
      fields.push({
        name: "Logs",
        value: logCodeBlock,
        inline: false,
      });
    }
  
    const embed = {
      title: "Output from Barking Cloud: " + (success ? "Success" : "Failure"),
      description: message,
      color: success ? 0x00FF00 : 0xFF0000,  // Green for success, Red for failure
      timestamp: new Date(),
      fields: fields,
    };
  
    const payload = {
      embeds: [embed],
    };
  
    try {
      const response = await fetch(webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        console.log('Message sent successfully!');
      } else {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending webhook:', error);
    }
  }
  
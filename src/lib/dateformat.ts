import moment from "moment";

const formatMessageTime = (timestamp: string) => {
  const now = moment();
  const messageTime = moment.utc(timestamp).local(); // Convert to local timezone

  const diffMinutes = now.diff(messageTime, "minutes");
  const diffHours = now.diff(messageTime, "hours");
  const diffDays = now.diff(messageTime, "days");

  if (diffMinutes < 1) return "Just now"; // Less than a minute
  if (diffMinutes < 60) return `${diffMinutes} min ago`; // Less than an hour
  if (diffHours < 12) return messageTime.format("hh:mm A"); // Same day, show time
  if (diffDays < 5) return messageTime.format("ddd, hh:mm A"); // Less than 5 days, show weekday & time
  return messageTime.format("DD MMM, YYYY"); // Older messages, show full date
};

export default formatMessageTime;
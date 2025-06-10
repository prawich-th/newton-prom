export const interpretTrack = (track: string) => {
  switch (track) {
    case "Medicine":
      return "Medicine & Health Science";
    case "Computer":
      return "AI & Computer Science";
    case "Science":
      return "Science & Engineering";
    case "Business":
      return "Newton Business School (NBS)";
    case "Arts":
      return "Art & Design";
    case "Other":
      return "External";
    default:
      return "External";
  }
};

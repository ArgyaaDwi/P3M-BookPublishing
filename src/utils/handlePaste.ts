export const handlePasteText = async (): Promise<string | null> => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return null;
  
      return text.startsWith("http://") || text.startsWith("https://")
        ? text
        : `https://${text}`;
    } catch (err) {
      console.error("Gagal membaca clipboard", err);
      return null;
    }
  };
// --- FAQ Accordion Logic ---
// Allows only one FAQ item to be expanded at a time
faqBoxes.forEach(box => {
  box.addEventListener('click', () => {
    const isActive = box.classList.contains('active');
    faqBoxes.forEach(other => other.classList.remove('active'));
    if (!isActive) {
      box.classList.add('active');
    }
  });
});
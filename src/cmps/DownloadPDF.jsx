import jsPDF from "jspdf";

export function DownloadPDF({ bugs }) {
  const bugsPerPage = 3; // Number of bugs per page

  const downloadPDF = () => {
    const pdf = new jsPDF();
    let pageIndex = 1;

    for (let i = 0; i < bugs.length; i += bugsPerPage) {
      pdf.addPage();
      let y = 20; // Reset y position for each new page
      pdf.text(20, y, `Page ${pageIndex++}`);

      for (let j = i; j < i + bugsPerPage && j < bugs.length; j++) {
        const bug = bugs[j];
        y += 10; // Adjust y position for bug information
        pdf.text(20, y, `Bug ${j + 1}:`);
        pdf.text(30, y + 10, `Bug ID: ${bug._id}:`);
        pdf.text(30, y + 20, `Title: ${bug.title}`);
        pdf.text(30, y + 30, `Severity: ${bug.severity}`);
        pdf.text(30, y + 40, `Description: ${bug.description}`);
        pdf.text(30, y + 50, `Labels: ${bug.labels}`);
        pdf.text(30, y + 60, `CreatedAt: ${bug.createdAt}`);
        y += 70; // Increase y position for the next bug
      }
    }
    pdf.save("bugs.pdf");
  };

  return (
    <button onClick={downloadPDF}>Download PDF</button>
  );
}

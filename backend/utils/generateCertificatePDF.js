const PDFDocument = require("pdfkit");

const generateCertificatePDF = (res, certificate) => {
  const doc = new PDFDocument({ size: "A4", layout: "landscape" });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=certificate-${certificate.certificateId}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.rect(0, 0, doc.page.width, doc.page.height).stroke();

  doc.fontSize(40).text("Certificate of Completion", {
    align: "center",
  });

  doc.moveDown(2);

  doc.fontSize(20).text("This certifies that", { align: "center" });

  doc.moveDown();

  doc.fontSize(32).text(certificate.studentName, { align: "center" });

  doc.moveDown();

  doc.fontSize(20).text("has successfully completed", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(28).text(certificate.courseName, { align: "center" });

  doc.moveDown();

  doc.fontSize(18).text(`Grade: ${certificate.grade}`, {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(16).text(
    `Certificate ID: ${certificate.certificateId}`,
    { align: "center" }
  );

  doc.moveDown();

  doc.fontSize(16).text(
    `Issued: ${new Date(certificate.issueDate).toDateString()}`,
    { align: "center" }
  );

  doc.end();
};

module.exports = generateCertificatePDF;
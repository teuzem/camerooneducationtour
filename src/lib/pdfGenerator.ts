import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Partner } from './supabase'

export const generateRegistrationPDF = (partner: Partner) => {
  const doc = new jsPDF()

  // Header
  doc.setFillColor(0, 196, 154) // go2skul-green
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(255, 255, 255)
  doc.text('Go2Skul Education Group', 14, 15)
  doc.setFontSize(12)
  doc.setTextColor(230, 255, 250)
  doc.text('Confirmation d\'Inscription - Cameroon Education Tour 2026', 14, 23)

  // Main Title
  doc.setFontSize(18)
  doc.setTextColor(40, 40, 40)
  doc.text('Récapitulatif de votre inscription', 14, 45)

  // Information
  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text(`Merci, ${partner.contact_person}, d'avoir inscrit ${partner.name}.`, 14, 55)
  doc.text('Voici un résumé des informations que vous nous avez fournies.', 14, 61)

  // Data Table
  const tableData = [
    ['Institution', partner.name],
    ['Type', partner.type === 'foreign_university' ? 'Université Étrangère' : 'École Locale'],
    ['Personne de contact', partner.contact_person || ''],
    ['E-mail', partner.email],
    ['Téléphone', partner.phone || ''],
    ['Pays', partner.country || ''],
    ['Ville', partner.city || ''],
    ['Site Web', partner.website || 'N/A'],
    ['Description', partner.description || 'N/A'],
  ]

  autoTable(doc, {
    startY: 70,
    head: [['Champ', 'Information']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [59, 130, 246], // go2skul-blue
    },
    styles: {
      cellPadding: 3,
      fontSize: 10,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 'auto' },
    },
    didParseCell: function (data) {
        if (data.column.index === 1 && data.row.section === 'body') {
            // For the description row
            if (data.row.index === 8) {
                data.cell.styles.minCellHeight = 20;
            }
        }
    }
  })

  // Next Steps
  const finalY = (doc as any).lastAutoTable.finalY || 150
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text('Prochaines Étapes', 14, finalY + 15)

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)
  doc.text("Notre équipe examinera votre inscription et vous contactera sous peu avec plus de détails sur l'événement, y compris les informations sur les stands, le calendrier et les opportunités de réseautage.", 14, finalY + 22, { maxWidth: 180 })
  doc.text("Nous sommes ravis de vous compter parmi nous pour le Cameroon Education Tour 2026 !", 14, finalY + 35)

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFillColor(243, 244, 246) // gray-100
  doc.rect(0, pageHeight - 20, doc.internal.pageSize.getWidth(), 20, 'F')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`© ${new Date().getFullYear()} Go2Skul Education Group | contact@go2skul.com`, 14, pageHeight - 8)

  // Save the PDF
  doc.save(`Go2Skul_CET2026_Inscription_${partner.name.replace(/\s/g, '_')}.pdf`)
}

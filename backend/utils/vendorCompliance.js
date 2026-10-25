const db = require("../config/db");

const ensureComplianceTable = () => new Promise((resolve, reject) => {
    const sql = `
        CREATE TABLE IF NOT EXISTS vendor_compliance_details (
            vendor_id INT NOT NULL PRIMARY KEY,
            vendor_legal_name VARCHAR(255) NULL,
            business_type VARCHAR(100) NULL,
            primary_contact_person VARCHAR(255) NULL,
            regulatory_certifications TEXT NULL,
            bank_account_details TEXT NULL
        )
    `;

    db.query(sql, (err) => err ? reject(err) : resolve());
});

exports.ensureComplianceTable = ensureComplianceTable;

exports.saveVendorComplianceDetails = async (vendorId, details) => {
    await ensureComplianceTable();

    const sql = `
        INSERT INTO vendor_compliance_details
        (vendor_id, vendor_legal_name, business_type, primary_contact_person, regulatory_certifications, bank_account_details)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            vendor_legal_name = VALUES(vendor_legal_name),
            business_type = VALUES(business_type),
            primary_contact_person = VALUES(primary_contact_person),
            regulatory_certifications = VALUES(regulatory_certifications),
            bank_account_details = VALUES(bank_account_details)
    `;

    const values = [
        vendorId,
        details.vendor_legal_name || null,
        details.business_type || null,
        details.primary_contact_person || null,
        details.regulatory_certifications || null,
        details.bank_account_details || null
    ];

    return new Promise((resolve, reject) => {
        db.query(sql, values, (err) => err ? reject(err) : resolve());
    });
};

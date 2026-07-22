import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import nodemailer from 'nodemailer';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName, phone, email, preferredContact, dob, lastFourSSN,
      recordType, caseNumber, countyOfResidence, countyOfFiling,
      countyOfConviction, yearOfIncident, incidentDescription,
      completedProbation, outstandingFines, onProbation,
      multipleCases, referralSource,
    } = body;

    await pool.query(`
      CREATE TABLE IF NOT EXISTS intake_submissions (
        id SERIAL PRIMARY KEY,
        full_name TEXT, phone TEXT, email TEXT,
        preferred_contact TEXT, dob TEXT, last_four_ssn TEXT,
        record_type TEXT, case_number TEXT,
        county_of_residence TEXT, county_of_filing TEXT,
        county_of_conviction TEXT, year_of_incident TEXT,
        incident_description TEXT,
        completed_probation BOOLEAN, outstanding_fines BOOLEAN,
        on_probation BOOLEAN, multiple_cases BOOLEAN,
        referral_source TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await pool.query(
      `INSERT INTO intake_submissions (
        full_name, phone, email, preferred_contact, dob, last_four_ssn,
        record_type, case_number, county_of_residence, county_of_filing,
        county_of_conviction, year_of_incident, incident_description,
        completed_probation, outstanding_fines, on_probation,
        multiple_cases, referral_source
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        fullName, phone, email, preferredContact, dob, lastFourSSN,
        recordType, caseNumber, countyOfResidence, countyOfFiling,
        countyOfConviction, yearOfIncident, incidentDescription,
        completedProbation, outstandingFines, onProbation,
        multipleCases, referralSource,
      ]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.NOTIFY_EMAIL,
      subject: `New Clean Slate Intake: ${fullName}`,
      html: `<h2>New Intake Submission</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Preferred Contact:</strong> ${preferredContact}</p>
        <p><strong>DOB:</strong> ${dob}</p>
        <p><strong>Record Type:</strong> ${recordType}</p>
        <p><strong>Case #:</strong> ${caseNumber}</p>
        <p><strong>County of Residence:</strong> ${countyOfResidence}</p>
        <p><strong>County of Filing:</strong> ${countyOfFiling}</p>
        <p><strong>Year of Incident:</strong> ${yearOfIncident}</p>
        <p><strong>Completed Probation:</strong> ${completedProbation ? 'Yes' : 'No'}</p>
        <p><strong>Outstanding Fines:</strong> ${outstandingFines ? 'Yes' : 'No'}</p>
        <p><strong>On Probation/Parole:</strong> ${onProbation ? 'Yes' : 'No'}</p>
        <p><strong>Multiple Cases:</strong> ${multipleCases ? 'Yes' : 'No'}</p>
        <p><strong>Referral Source:</strong> ${referralSource}</p>
        <p><strong>Description:</strong> ${incidentDescription}</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/submit] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

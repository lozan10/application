import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from '@/lib/cloudinary';

async function saveFile(file, subDir) {
  if (!file || typeof file === 'string') return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(base64, {
    upload_preset: 'smarischool',
    folder: `smari/${subDir}`,
    resource_type: 'auto',
    use_filename: true,
    unique_filename: true,
    filename_override: file.name,
  });

  return result.secure_url;
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const courseId = formData.get('course');
    const fullName = formData.get('fullName');
    const dob = formData.get('dob');
    const gender = formData.get('gender');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const address = formData.get('address');
    const city = formData.get('city') || '';
    const country = formData.get('country') || 'Uganda';
    const kinName = formData.get('kinName');
    const kinPhone = formData.get('kinPhone');
    const education = formData.get('education');
    const school = formData.get('school');
    const yearDone = formData.get('yearDone') || '';
    const working = formData.get('working') || '';
    const funding = formData.get('funding');
    const heardFrom = formData.get('heardFrom') || '';
    const photoFile = formData.get('photo');

    // Validate required fields
    const errors = [];
    if (!courseId) errors.push('Course is required');
    if (!fullName) errors.push('Full name is required');
    if (!dob) errors.push('Date of birth is required');
    if (!gender) errors.push('Gender is required');
    if (!phone) errors.push('Phone is required');
    if (!email) errors.push('Email is required');
    if (!address) errors.push('Address is required');
    if (!kinName) errors.push('Next of kin name is required');
    if (!kinPhone) errors.push('Next of kin phone is required');
    if (!education) errors.push('Education level is required');
    if (!school) errors.push('School is required');
    if (!funding) errors.push('Funding option is required');
    if (!photoFile || typeof photoFile === 'string') errors.push('Passport photo is required');

    const isTenDigitPhone = (v) => /^\d{10}$/.test(String(v || '').replace(/\D/g, ''));
    if (phone && !isTenDigitPhone(phone)) errors.push('Phone must be a valid 10-digit number');
    if (kinPhone && !isTenDigitPhone(kinPhone)) errors.push('Next of kin phone must be a valid 10-digit number');

    if (dob) {
      const dobDate = new Date(dob);
      if (Number.isNaN(dobDate.getTime())) {
        errors.push('Date of birth is invalid');
      } else {
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const monthDiff = today.getMonth() - dobDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) age--;
        if (age < 10) errors.push('Applicant must be at least 10 years old');
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    // Find course
    const course = await prisma.course.findUnique({ where: { courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Invalid course selected' }, { status: 400 });
    }

    // Save files
    const idDocFile = formData.get('idDoc');
    const certDocFile = formData.get('certDoc');

    const photoUrl = await saveFile(photoFile, 'photos');
    const idDocUrl = await saveFile(idDocFile, 'docs');
    const certDocUrl = await saveFile(certDocFile, 'docs');

    // Generate reference number
    const refNo = 'SMARI-2026-' + Math.floor(10000 + Math.random() * 89999);

    // Create application
    const application = await prisma.application.create({
      data: {
        refNo,
        courseId: course.id,
        fullName,
        dob,
        gender,
        phone,
        email,
        address,
        city,
        country,
        kinName,
        kinPhone,
        education,
        school,
        yearDone,
        working,
        funding,
        heardFrom,
        photoUrl,
        idDocUrl,
        certDocUrl,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ refNo: application.refNo, id: application.id }, { status: 201 });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 });
  }
}

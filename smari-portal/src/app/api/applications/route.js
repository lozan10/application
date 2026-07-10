import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function saveFile(file, subDir) {
  if (!file || typeof file === 'string') return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
  await mkdir(uploadDir, { recursive: true });

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${safeName}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);
  return `/uploads/${subDir}/${fileName}`;
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

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    // Find course
    const course = await prisma.course.findUnique({ where: { courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Invalid course selected' }, { status: 400 });
    }

    // Save files
    const photoFile = formData.get('photo');
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

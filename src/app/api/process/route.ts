import { NextRequest, NextResponse } from 'next/server';
import { combinedEncrypt, combinedDecrypt } from '@/utils/encryption/combined';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const operation = formData.get('operation') as 'encrypt' | 'decrypt';
    const settings = JSON.parse(formData.get('settings') as string);

    if (!file || !operation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check file extension
    const fileType = file.name.split('.').pop()?.toLowerCase();
    const textBasedTypes = ['txt', 'json', 'xml'];
    
    if (!textBasedTypes.includes(fileType || '')) {
      return NextResponse.json(
        { error: 'Currently only supporting text-based files (txt, json, xml)' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const content = new TextDecoder().decode(buffer);
    
    let result: string;
    let additionalData = {};

    if (operation === 'encrypt') {
      const { encrypted, vernamKey } = combinedEncrypt(content, settings);
      result = encrypted;
      additionalData = { vernamKey };
    } else {
      if (!settings.vernamKey) {
        throw new Error('Vernam key required for decryption');
      }
      result = combinedDecrypt(content, settings, settings.vernamKey);
    }

    const response = new NextResponse(result, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${operation === 'encrypt' ? 'encrypted' : 'decrypted'}_${file.name}"`,
      },
    });

    if (Object.keys(additionalData).length > 0) {
      response.headers.set('X-Additional-Data', JSON.stringify(additionalData));
    }

    return response;
  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process file' },
      { status: 500 }
    );
  }
} 
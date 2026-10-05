import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { encode, decode } from "https://deno.land/std@0.168.0/encoding/base64.ts"

// 1. THE FIX FOR THE CORS ERROR:
// We must explicitly tell the browser that these headers are allowed!
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 2. Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const action = formData.get('action') as string
    const password = formData.get('password') as string || '123456'

    if (!file) {
      throw new Error('No file uploaded')
    }

    // -------------------------------------------------------------------
    // 3. REAL CONVERSION LOGIC (Using ConvertAPI)
    // -------------------------------------------------------------------
    
    // IMPORTANT: Get your free secret at https://www.convertapi.com/
    // Replace 'YOUR_FREE_SECRET_HERE' with your actual secret key!
    const CONVERT_API_SECRET = 'YOUR_FREE_SECRET_HERE';

    if (CONVERT_API_SECRET === 'YOUR_FREE_SECRET_HERE') {
        throw new Error("ConvertAPI Secret is missing! Please edit the Edge Function code (index.ts) to add your free ConvertAPI secret.");
    }

    let endpoint = '';
    let extraParams: any[] = [];

    // Map our app's actions to ConvertAPI's endpoints
    if (action === 'Word to PDF') {
      endpoint = `https://v2.convertapi.com/convert/docx/pdf?Secret=${CONVERT_API_SECRET}`;
    } else if (action === 'Excel to PDF') {
      endpoint = `https://v2.convertapi.com/convert/xlsx/pdf?Secret=${CONVERT_API_SECRET}`;
    } else if (action === 'Protect PDF') {
      endpoint = `https://v2.convertapi.com/convert/pdf/encrypt?Secret=${CONVERT_API_SECRET}`;
      extraParams = [{ Name: 'UserPassword', Value: password }];
    } else {
      throw new Error(`Unsupported action: ${action}`);
    }

    // Convert the uploaded file to Base64 so we can send it to ConvertAPI
    const arrayBuffer = await file.arrayBuffer();
    const base64File = encode(new Uint8Array(arrayBuffer));

    const convertApiPayload = {
        Parameters: [
            {
                Name: 'File',
                FileValue: {
                    Name: file.name,
                    Data: base64File
                }
            },
            ...extraParams
        ]
    };

    // Send the file to ConvertAPI
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(convertApiPayload)
    });

    const result = await response.json();

    if (result.error || !result.Files || result.Files.length === 0) {
        throw new Error(result.error?.Message || "Conversion failed at ConvertAPI");
    }

    // Decode the returned Base64 file back into binary bytes
    const fileData = result.Files[0].FileData;
    const bytes = decode(fileData);

    // 4. Return the converted file to the frontend!
    return new Response(bytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="converted_${file.name}.pdf"`,
      },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

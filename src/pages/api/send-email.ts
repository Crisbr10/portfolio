import { Resend } from 'resend';
import type { APIRoute } from 'astro';

const resend = new Resend(import.meta.env.PUBLIC_RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;    const { data: emailResponse, error } = await resend.emails.send({
      from: import.meta.env.PUBLIC_RESEND_FROM_EMAIL,
      to: import.meta.env.PUBLIC_RESEND_TO_EMAIL,
      subject: `Contacto Portfolio: ${subject}`,
      reply_to: email,
      text: `Nuevo mensaje de contacto:
      
Nombre: ${name}
Email: ${email}
Asunto: ${subject}
Mensaje: ${message}`
    });

    if (error) {
      console.error('Error de Resend:', error);
      return new Response(JSON.stringify({ 
        message: 'Error al enviar el email',
        error: error.message
      }), { status: 400 });
    }

    return new Response(JSON.stringify({
      message: 'Email enviado correctamente'
    }), { status: 200 });
    
  } catch (error) {
    console.error('Error del servidor:', error);
    return new Response(JSON.stringify({
      message: 'Error en el servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    }), { status: 500 });
  }
};

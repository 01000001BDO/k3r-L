import { NextRequest, NextResponse } from 'next/server';
import { connecterDB } from '@/lib/db';
import { ModeleCommande } from '@/models/commande';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.commandeId) {
      return new NextResponse(JSON.stringify({ error: 'ID de commande manquant' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    await connecterDB();
    
    const commande = await ModeleCommande.findById(data.commandeId);
    
    if (!commande) {
      return new NextResponse(JSON.stringify({ error: 'Commande non trouvée' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    
    return new NextResponse(JSON.stringify({ message: 'Notification reçue' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return new NextResponse(JSON.stringify({ 
      error: 'Erreur lors du traitement du webhook',
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
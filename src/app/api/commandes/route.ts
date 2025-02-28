import { NextRequest, NextResponse } from 'next/server';
import { connecterDB } from '@/lib/db';
import { ModeleCommande } from '@/models/commande';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function GET() {
  try {
    await connecterDB();
    const commandes = await ModeleCommande.find({}).sort({ createdAt: -1 });
    
    return new NextResponse(JSON.stringify(commandes), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return new NextResponse(JSON.stringify({
      error: 'Erreur lors de la récupération des commandes',
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    await connecterDB();
    
    const now = new Date();
    const commandeAvecMetadata = {
      ...data,
      createdAt: now,
      updatedAt: now,
      historique: [{
        statut: data.statut || 'en_attente',
        date: now,
        commentaire: 'Commande créée'
      }]
    };
    
    const nouvelleCommande = await ModeleCommande.create(commandeAvecMetadata);
    
    return new NextResponse(JSON.stringify(nouvelleCommande), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    return new NextResponse(JSON.stringify({
      error: 'Erreur lors de la création de la commande',
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

export async function DELETE() {
  try {
    await connecterDB();
    
    const result = await ModeleCommande.deleteMany({});
    
    return new NextResponse(JSON.stringify({
      message: 'Toutes les commandes ont été supprimées avec succès',
      count: result.deletedCount
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression des commandes:", error);
    return new NextResponse(JSON.stringify({
      error: 'Erreur lors de la suppression des commandes',
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
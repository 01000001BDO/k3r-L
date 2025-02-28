import { NextRequest, NextResponse } from 'next/server';
import { connecterDB } from '@/lib/db';
import { ModeleCommande } from '@/models/commande';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    await connecterDB();
    const dateLimit = new Date();
    dateLimit.setHours(dateLimit.getHours() - 24);
    
    const nouvellesCommandes = await ModeleCommande.find({
      createdAt: { $gte: dateLimit },
    }).sort({ createdAt: -1 }).limit(10);
    
    return new NextResponse(JSON.stringify({ 
      nouvellesCommandes: nouvellesCommandes,
      count: nouvellesCommandes.length 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des nouvelles commandes:", error);
    return new NextResponse(JSON.stringify({
      error: 'Erreur lors de la récupération des nouvelles commandes',
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
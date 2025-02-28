import { NextRequest, NextResponse } from 'next/server';
import { connecterDB } from '@/lib/db';
import { ModeleProduit } from '@/models/produit';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function GET() {
  try {
    await connecterDB();
    const produits = await ModeleProduit.find({});
    
    return new NextResponse(JSON.stringify(produits), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    return new NextResponse(JSON.stringify({ error: 'Erreur lors de la récupération des produits' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const produit = await req.json();
    await connecterDB();
    const nouveauProduit = await ModeleProduit.create(produit);
    
    return new NextResponse(JSON.stringify(nouveauProduit), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error);
    return new NextResponse(JSON.stringify({ error: 'Erreur lors de la création du produit' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
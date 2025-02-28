import { NextRequest, NextResponse } from 'next/server';
import { connecterDB } from '@/lib/db';
import { ModeleProduit } from '@/models/produit';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object
    const unwrappedParams = await params;
    const id = unwrappedParams.id;

    await connecterDB();
    const produit = await ModeleProduit.findById(id);

    if (!produit) {
      return new NextResponse(JSON.stringify({ error: 'Produit non trouvé' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new NextResponse(JSON.stringify(produit), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error);
    return new NextResponse(JSON.stringify({ error: 'Erreur lors de la récupération du produit' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object
    const unwrappedParams = await params;
    const id = unwrappedParams.id;

    const miseAJour = await request.json();
    await connecterDB();

    const produitMisAJour = await ModeleProduit.findByIdAndUpdate(
      id,
      miseAJour,
      { new: true }
    );

    if (!produitMisAJour) {
      return new NextResponse(JSON.stringify({ error: 'Produit non trouvé' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new NextResponse(JSON.stringify(produitMisAJour), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return new NextResponse(JSON.stringify({ error: 'Erreur lors de la mise à jour du produit' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await the params object
    const unwrappedParams = await params;
    const id = unwrappedParams.id;

    await connecterDB();
    const produitSupprime = await ModeleProduit.findByIdAndDelete(id);

    if (!produitSupprime) {
      return new NextResponse(JSON.stringify({ error: 'Produit non trouvé' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new NextResponse(JSON.stringify({ message: 'Produit supprimé avec succès' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return new NextResponse(JSON.stringify({ error: 'Erreur lors de la suppression du produit' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
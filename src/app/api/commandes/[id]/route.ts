import { NextRequest, NextResponse } from 'next/server';
import { connecterDB } from '@/lib/db';
import { ModeleCommande } from '@/models/commande';
import mongoose from 'mongoose';

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

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse(JSON.stringify({ error: 'ID de commande invalide' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    await connecterDB();
    const commande = await ModeleCommande.findById(id);
   
    if (!commande) {
      return new NextResponse(JSON.stringify({ error: 'Commande non trouvée' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
   
    return new NextResponse(JSON.stringify(commande), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    return new NextResponse(JSON.stringify({
      error: 'Erreur lors de la récupération de la commande',
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

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {

    const params = await context.params;
    const id = params.id;    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse(JSON.stringify({ error: 'ID de commande invalide' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    const updateData = await request.json();
    await connecterDB();
   
    const commandeMiseAJour = await ModeleCommande.findOneAndUpdate(
      { _id: id },
      {
        $set: { statut: updateData.statut },
        $push: {
          historique: {
            statut: updateData.statut,
            date: new Date(),
            commentaire: updateData.commentaire || `Statut changé à "${updateData.statut}"`
          }
        }
      },
      {
        new: true,          
        runValidators: false
      }
    );
   
    if (!commandeMiseAJour) {
      return new NextResponse(JSON.stringify({ error: 'Commande non trouvée' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
   
    return new NextResponse(JSON.stringify(commandeMiseAJour), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    return new NextResponse(JSON.stringify({
      error: 'Erreur lors de la mise à jour de la commande',
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

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = params.id;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse(JSON.stringify({ error: 'ID de commande invalide' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    await connecterDB();
    
    const commandeSupprimee = await ModeleCommande.findByIdAndDelete(id);
    
    if (!commandeSupprimee) {
      return new NextResponse(JSON.stringify({ error: 'Commande non trouvée' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    return new NextResponse(JSON.stringify({ message: 'Commande supprimée avec succès' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande:", error);
    return new NextResponse(JSON.stringify({
      error: 'Erreur lors de la suppression de la commande',
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
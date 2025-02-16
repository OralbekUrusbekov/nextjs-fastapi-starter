'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Pencil, Trash2, Plus, Link } from 'lucide-react';

interface Ticket {
  id: number;
  title: string;
  description: string;
  price: number;
}

export default function TicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    price: 0,
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch('`${process.env.NEXT_PUBLIC_URL}/catalogs');
      if (!response.ok) throw new Error('Failed to fetch tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('`${process.env.NEXT_PUBLIC_URL}/catalogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      });
      if (!response.ok) throw new Error('Failed to create ticket');
      await fetchTickets();
      setNewTicket({ title: '', description: '', price: 0 });
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const ticketToUpdate = tickets.find((ticket) => ticket.id === id);
      if (!ticketToUpdate) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/catalogs/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticketToUpdate),
        }
      );
      if (!response.ok) throw new Error('Failed to update ticket');
      setEditingId(null);
      await fetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/catalogs/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (!response.ok) throw new Error('Failed to delete ticket');
      await fetchTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <Card key={ticket.id}>
          <CardHeader>
            <CardTitle>
              {editingId === ticket.id ? (
                <Input
                  value={ticket.title}
                  onChange={(e) =>
                    setTickets(
                      tickets.map((t) =>
                        t.id === ticket.id ? { ...t, title: e.target.value } : t
                      )
                    )
                  }
                />
              ) : (
                ticket.title
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingId === ticket.id ? (
              <div className="space-y-2">
                <Input
                  value={ticket.description}
                  onChange={(e) =>
                    setTickets(
                      tickets.map((t) =>
                        t.id === ticket.id
                          ? { ...t, description: e.target.value }
                          : t
                      )
                    )
                  }
                />
                <Input
                  type="number"
                  value={ticket.price}
                  onChange={(e) =>
                    setTickets(
                      tickets.map((t) =>
                        t.id === ticket.id
                          ? { ...t, price: Number(e.target.value) }
                          : t
                      )
                    )
                  }
                />
              </div>
            ) : (
              <div>
                <p>{ticket.description}</p>
                <p className="font-bold mt-2">Price: ${ticket.price}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between">
            {editingId === ticket.id ? (
              <Button onClick={() => handleUpdate(ticket.id)}>Save</Button>
            ) : (
              <Button variant="outline" onClick={() => setEditingId(ticket.id)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => handleDelete(ticket.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation'; 

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SuccessBox({ open, onOpenChange }: SuccessDialogProps) {
    const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-8 bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-emerald-700 mb-2">
            Usuário cadastrado com sucesso!
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            O usuário foi registrado no sistema com sucesso. Agora você pode fazer login com as credenciais criadas.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button 
            onClick={() => router.push('/profile')}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Ok
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer"
import Button from './button'
import Input from './input.jsx'

export default function CredentialsDrawer({ open, onConfirm, onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const drawerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <Drawer open={open}>
      <DrawerContent ref={drawerRef}>
        <DrawerHeader className='flex flex-col pb-10 pt-12 gap-y-6'>
          <p className='font-semibold'>
            🛒 <span className='mr-1'></span> Ingresa tus credenciales de tu cuenta Jumbo para crear tu carrito
          </p>
          <Input
            placeholder="Ingresa tu rut o email"
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="Ingresa tu contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DrawerHeader>
        <DrawerFooter className='mb-12'>
          <Button
            text="Continuar"
            onClick={() => onConfirm(username, password)}
            disabled={!username || !password}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

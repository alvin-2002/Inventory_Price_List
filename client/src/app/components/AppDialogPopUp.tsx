import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import AppNameInput from './AppNameInput';

interface Props {
    name: string;
    isOpen: [open: boolean, setOpen: (value: boolean) => void];
    create: (value: string) => void;
    label: string;
}

export default function AppDialogPopUp({name, isOpen, create, label}: Props) {
    const [isDirty, setIsDirty] = useState(false);
    const [value, setValue] = useState('');
    const [open, setOpen] = isOpen;

    function handleClose() {
        setValue('');
        setOpen(false);
    }

    function handleCreate(e: any) {
        e.preventDefault();
        create(value);
        handleClose();
    }

    return (
        <div style={{marginBottom: '40px'}}>
        
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth={'sm'}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{pb: 0}}>
                    Create {label}
                </DialogTitle>
                <form onSubmit={handleCreate}>
                <DialogContent sx={{pb: 0}}>
                    <Box sx={{mt: 2}}>
                        <AppNameInput name={name} setIsDirty={setIsDirty} state={[value, setValue]} isEdit={false} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">
                        Create
                    </Button>
                </DialogActions>
                </form>
            </Dialog>
        </div>
    );
}

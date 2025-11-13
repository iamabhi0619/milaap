'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Search, UserPlus, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { User as UserType } from '@/types/table';
import { useUserStore } from '@/stores/userStore';
import { useChatStore } from '@/stores/chatStore';
import { toast } from 'sonner';

interface ChatAddDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    chatType: 'dm' | 'group' | null;
}

export function ChatAddDialog({ open, onOpenChange, chatType }: ChatAddDialogProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    
    const { user: currentUser } = useUserStore();
    const { addDM } = useChatStore();

    // Fetch users when dialog opens
    useEffect(() => {
        if (open && currentUser) {
            fetchUsers();
        }
    }, [open, currentUser]);

    const fetchUsers = async () => {
        if (!currentUser) return;
        
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .neq('id', currentUser.id)
                .order('name', { ascending: true });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateChat = async () => {
        if (!currentUser) {
            toast.error('You must be logged in');
            return;
        }

        try {
            setCreating(true);
            
            if (chatType === 'dm' && selectedUsers.length === 1) {
                // Create DM chat
                await addDM(selectedUsers[0]);
                toast.success('DM chat created successfully');
            } else if (chatType === 'group' && groupName && selectedUsers.length > 0) {
                // Create group chat logic
                console.log('Creating group:', groupName, 'with users:', selectedUsers);
                toast.info('Group chat creation coming soon!');
                // TODO: Implement group chat creation
            }
            
            handleClose();
        } catch (error) {
            console.error('Error creating chat:', error);
            toast.error('Failed to create chat');
        } finally {
            setCreating(false);
        }
    };

    const handleClose = () => {
        setSearchQuery('');
        setGroupName('');
        setSelectedUsers([]);
        onOpenChange(false);
    };

    const toggleUserSelection = (userId: string) => {
        if (chatType === 'dm') {
            // For DM, only allow one user
            setSelectedUsers([userId]);
        } else {
            // For group, allow multiple users
            setSelectedUsers(prev =>
                prev.includes(userId)
                    ? prev.filter(id => id !== userId)
                    : [...prev, userId]
            );
        }
    };

    const filteredUsers = users.filter(user => {
        const query = searchQuery.toLowerCase();
        return (
            (user.name?.toLowerCase().includes(query)) ||
            (user.username?.toLowerCase().includes(query))
        );
    });

    const getInitials = (name?: string | null) => {
        if (!name) return '??';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isValid = chatType === 'dm'
        ? selectedUsers.length === 1
        : groupName.trim() && selectedUsers.length > 0;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {chatType === 'dm' ? (
                            <>
                                <MessageCircle className="h-5 w-5" />
                                New Direct Message
                            </>
                        ) : (
                            <>
                                <Users className="h-5 w-5" />
                                Create Group Chat
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        {chatType === 'dm'
                            ? 'Select a user to start a direct conversation'
                            : 'Create a new group chat with multiple users'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {chatType === 'group' && (
                        <div className="space-y-2">
                            <Label htmlFor="groupName">Group Name</Label>
                            <Input
                                id="groupName"
                                placeholder="Enter group name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>
                            {chatType === 'dm' ? 'Select User' : 'Add Members'}
                        </Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {selectedUsers.length > 0 && chatType === 'group' && (
                        <>
                            <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                                {selectedUsers.map(userId => {
                                    const user = users.find(u => u.id === userId);
                                    return user ? (
                                        <div
                                            key={userId}
                                            className="flex items-center gap-1.5 px-2 py-1 bg-background rounded-md text-sm"
                                        >
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage src={user.avatar || undefined} />
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(user.name || user.username)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>{user.name || user.username}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                            <Separator />
                        </>
                    )}

                    <ScrollArea className="h-[280px] rounded-md border p-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                <p className="text-sm">Loading users...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <div className="space-y-1">
                                {filteredUsers.map(user => (
                                    <button
                                        key={user.id}
                                        onClick={() => toggleUserSelection(user.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-accent ${selectedUsers.includes(user.id)
                                            ? 'bg-accent border border-primary'
                                            : ''
                                            }`}
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatar || undefined} />
                                            <AvatarFallback>
                                                {getInitials(user.name || user.username)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium">{user.name || user.username}</p>
                                            <p className="text-xs text-muted-foreground">
                                                @{user.username}
                                            </p>
                                        </div>
                                        {selectedUsers.includes(user.id) && (
                                            <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                                <UserPlus className="h-3 w-3 text-primary-foreground" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <Search className="h-10 w-10 mb-2 opacity-50" />
                                <p className="text-sm">No users found</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={creating}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreateChat} disabled={!isValid || creating}>
                        {creating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Creating...
                            </>
                        ) : (
                            chatType === 'dm' ? 'Start Chat' : 'Create Group'
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

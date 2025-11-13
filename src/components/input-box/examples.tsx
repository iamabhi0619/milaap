/**
 * InputBox Usage Examples
 * 
 * This file demonstrates various ways to use the InputBox component
 * in different scenarios throughout your chat application.
 */

'use client';

import InputBox, { SendMessageData } from '@/components/InputBox';
import { useMessageStore } from '@/stores/message';
import { useState } from 'react';

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

export function BasicInputBoxExample() {
  const selectedChatId = useMessageStore((state) => state.selectedChatId);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* Your message list component */}
      </div>
      
      {/* Simple InputBox - most common use case */}
      <InputBox chatId={selectedChatId} />
    </div>
  );
}

// ============================================================================
// Example 2: With Custom Send Handler
// ============================================================================

export function CustomHandlerExample() {
  const selectedChatId = useMessageStore((state) => state.selectedChatId);

  const handleCustomSend = async (data: SendMessageData) => {
    console.log('Message data:', data);
    
    // You can add custom logic here:
    // - Analytics tracking
    // - Message formatting
    // - Custom validation
    // - Additional API calls
    
    if (data.text?.includes('@everyone')) {
      // Handle mentions
      console.log('Mentioned everyone!');
    }
    
    if (data.attachments && data.attachments.length > 0) {
      // Handle file uploads to your CDN
      console.log('Uploading files:', data.attachments);
    }
  };

  return (
    <InputBox 
      chatId={selectedChatId}
      onSend={handleCustomSend}
      placeholder="Type @ to mention someone..."
      maxLength={5000}
    />
  );
}

// ============================================================================
// Example 3: Disabled State (e.g., user blocked or chat archived)
// ============================================================================

export function DisabledInputBoxExample() {
  const selectedChatId = useMessageStore((state) => state.selectedChatId);
  const [isBlocked] = useState(false);
  const [isArchived] = useState(false);

  const isDisabled = isBlocked || isArchived;
  const disabledMessage = isBlocked 
    ? "You can't send messages to this user" 
    : "This chat is archived";

  return (
    <div>
      {isDisabled && (
        <div className="text-center text-sm text-muted-foreground py-2 bg-muted/50">
          {disabledMessage}
        </div>
      )}
      <InputBox 
        chatId={selectedChatId}
        disabled={isDisabled}
        placeholder={isDisabled ? disabledMessage : "Type a message..."}
      />
    </div>
  );
}

// ============================================================================
// Example 4: With Reply Feature
// ============================================================================

export function ReplyFeatureExample() {
  const selectedChatId = useMessageStore((state) => state.selectedChatId);
  
  // In a real app, you'd get this from clicking a reply button on a message
  const handleReplyToMessage = (messageId: string) => {
    // The InputBox component manages reply state internally
    // You can extend it to expose a setReplyTo method if needed
    console.log('Replying to message:', messageId);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {/* Your messages with reply buttons */}
        <div className="p-4">
          <div className="bg-card p-3 rounded-lg">
            <p className="text-sm">Hello! How are you?</p>
            <button 
              onClick={() => handleReplyToMessage('msg-123')}
              className="text-xs text-primary mt-2"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
      
      <InputBox chatId={selectedChatId} />
    </div>
  );
}

// ============================================================================
// Example 5: Group Chat with Typing Indicators
// ============================================================================

export function GroupChatExample() {
  const selectedChatId = useMessageStore((state) => state.selectedChatId);
  const isGroup = useMessageStore((state) => state.isGroup);
  
  // In a real app, you'd get typing users from real-time subscriptions
  const [typingUsers] = useState<string[]>([]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto">
        {/* Messages */}
      </div>
      
      {/* Show typing indicator above input box */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-muted-foreground border-t border-border">
          {typingUsers.length === 1 
            ? `${typingUsers[0]} is typing...`
            : `${typingUsers.join(', ')} are typing...`
          }
        </div>
      )}
      
      <InputBox 
        chatId={selectedChatId}
        placeholder={isGroup ? "Message the group..." : "Type a message..."}
      />
    </div>
  );
}

// ============================================================================
// Example 6: With File Upload Progress
// ============================================================================

export function FileUploadExample() {
  const selectedChatId = useMessageStore((state) => state.selectedChatId);

  const handleSendWithFileUpload = async (data: SendMessageData) => {
    if (data.attachments && data.attachments.length > 0) {
      // Upload files and track progress
      for (const attachment of data.attachments) {
        try {
          // Simulated upload - replace with your actual upload logic
          const formData = new FormData();
          formData.append('file', attachment.file);
          
          // Example with fetch and progress tracking
          // In reality, you'd use your file upload service (e.g., Cloudinary)
          console.log('Uploading:', attachment.name);
          
          // Update progress - implement your own progress tracking
          // setUploadProgress(prev => ({
          //   ...prev,
          //   [attachment.id]: 100
          // }));
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    }
  };

  return (
    <InputBox 
      chatId={selectedChatId}
      onSend={handleSendWithFileUpload}
    />
  );
}

// ============================================================================
// Example 7: Chat Page Integration (Complete Example)
// ============================================================================

export function CompleteChatPageExample() {
  const { selectedChatId, messages } = useMessageStore();

  const handleReply = () => {
    // Implement reply logic here
    console.log('Reply clicked');
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Chat Header */}
      <div className="border-b border-border p-4">
        <h1 className="font-semibold">Chat Name</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="bg-card p-3 rounded-lg">
              <p>{message.text}</p>
              <button 
                onClick={() => handleReply()}
                className="text-xs text-primary mt-2"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <InputBox 
        chatId={selectedChatId}
        placeholder="Type a message..."
        maxLength={4000}
      />
    </div>
  );
}

// ============================================================================
// Example 8: Mobile Responsive Layout
// ============================================================================

export function MobileResponsiveExample() {
  const selectedChatId = useMessageStore((state) => state.selectedChatId);

  return (
    <div className="flex flex-col h-screen">
      {/* Header - Sticky on mobile */}
      <div className="sticky top-0 z-10 border-b border-border bg-card p-4 md:p-6">
        <h1 className="font-semibold text-lg md:text-xl">Chat</h1>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        {/* Messages here */}
      </div>

      {/* Input Box - Sticky at bottom */}
      <div className="sticky bottom-0 z-10 bg-card">
        <InputBox 
          chatId={selectedChatId}
          placeholder="Message..."
        />
      </div>
    </div>
  );
}

// ============================================================================
// Tips for Usage:
// ============================================================================

/*
1. Always provide chatId - it's required for sending messages
2. The component handles its own state internally - no need to manage text/attachments
3. Use onSend callback for custom logic like analytics or formatting
4. The component integrates with your Zustand stores automatically
5. All styling follows your Shadcn UI theme
6. Voice recording requires HTTPS in production
7. Test file uploads with different file types and sizes
8. Consider adding loading states for better UX
9. Handle errors gracefully with toast notifications
10. Make sure your backend supports all message types (text, images, voice, etc.)
*/

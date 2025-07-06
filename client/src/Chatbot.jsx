import React, { useState, useEffect, useRef } from 'react';
import { Container, TextField, Button, Box, Paper, Typography, CircularProgress, AppBar, Toolbar, List, ListItem, ListItemText, useTheme, } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getGeminiResponse } from './api/pyApi';

function Chatbot(props) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const theme = useTheme();

    // Effect to scroll to the bottom of the chat whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (input.trim() === '') return;

        const userMessage = input.trim();
        // Add the user's message to the chat history immediately
        setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            // Prepare the history for the API request
            // The API expects [[user1, bot1], [user2, bot2], ...]
            const historyForApi = messages.map((msg, index, arr) => {
                if (msg.sender === 'user' && arr[index + 1] && arr[index + 1].sender === 'bot') {
                    return [msg.text, arr[index + 1].text];
                }
                return null; // Filter out later
            }).filter(item => item !== null);

            // Add the current user message to the history for API call
            // Note: The API expects the current message separately, not in `history`
            // The `history` parameter is for *previous* turns.
            // So, we construct `historyForApi` from `messages` *before* adding the current `userMessage`
            // to the `messages` state.
            const apiHistory = [];
            for (let i = 0; i < messages.length; i += 2) {
                if (messages[i] && messages[i].sender === 'user' && messages[i + 1] && messages[i + 1].sender === 'bot') {
                    apiHistory.push([messages[i].text, messages[i + 1].text]);
                }
            }

            const response = await getGeminiResponse({
                message: userMessage,
                    history: apiHistory,
                })

            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            console.log(response)
            const data = await response.data;
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: data.response }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'bot', text: `Error: Could not get a response. (${error.message})` },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press in the input field
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !loading) {
            sendMessage();
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: '100vh',
                width: '100%',
                minWidth: '100vh',
                bgcolor: '#1E1E2F', // Dark background
            }}
        >
            {/* App Bar */}
            <AppBar
                position="static"
                sx={{
                    bgcolor: '#6A1B9A', // Rich purple
                    borderRadius: '8px',
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            color: '#FFFFFF',
                            fontWeight: 600,
                        }}
                    >
                        Budget Chat Assistant
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="md"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    py: 2,
                }}
            >
                {/* Chat Messages */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflowY: 'auto',
                        p: 2,
                        mb: 2,
                        border: '1px solid #CE93D8',
                        borderRadius: '8px',
                        bgcolor: '#2C2C3E', // Dark surface
                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    <List>
                        {messages.map((msg, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    mb: 1,
                                }}
                            >
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '75%',
                                        borderRadius: '12px',
                                        bgcolor: msg.sender === 'user' ? '#8E24AA' : '#424242',
                                        color: '#FFFFFF',
                                        wordBreak: 'break-word',
                                        '& h1, & h2, & h3, & h4, & h5, & h6': {
                                            marginBottom: theme.spacing(1),
                                            marginTop: theme.spacing(2),
                                        },
                                        '& p': {
                                            marginBottom: theme.spacing(1),
                                        },
                                        '& ul, & ol': {
                                            marginLeft: theme.spacing(2),
                                            marginBottom: theme.spacing(1),
                                        },
                                        '& code': {
                                            fontFamily: 'monospace',
                                            backgroundColor: theme.palette.grey[300],
                                            padding: '2px 4px',
                                            borderRadius: '4px',
                                        },
                                        '& pre': {
                                            backgroundColor: theme.palette.grey[800],
                                            color: theme.palette.common.white,
                                            padding: theme.spacing(1),
                                            borderRadius: theme.shape.borderRadius,
                                            overflowX: 'auto',
                                        },
                                        '& a': {
                                            color: theme.palette.primary.main,
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </Paper>
                            </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                    </List>

                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <CircularProgress size={24} sx={{ color: '#CE93D8' }} />
                        </Box>
                    )}
                </Box>

                {/* Message Input */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        mt: 'auto',
                        p: 1,
                        bgcolor: '#2C2C3E',
                        borderRadius: '8px',
                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Ask about your budget..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                        InputProps={{
                            sx: {
                                borderRadius: '8px',
                                bgcolor: '#1E1E2F',
                                color: '#FFFFFF',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#8E24AA',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#CE93D8',
                                },
                            },
                        }}
                        InputLabelProps={{
                            sx: { color: '#B0B0B0' },
                        }}
                    />
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={sendMessage}
                        disabled={loading || input.trim() === ''}
                        sx={{
                            borderRadius: '8px',
                            minWidth: '100px',
                            bgcolor: '#8E24AA',
                            color: '#FFFFFF',
                            '&:hover': {
                                bgcolor: '#6A1B9A',
                            },
                        }}
                    >
                        Send
                    </Button>
                </Box>
            </Container>

            <Button
                variant="contained"
                sx={{
                    backgroundColor: "#4f378b",
                    color: "white",
                    "&:hover": { backgroundColor: "#3d2a6d" },
                    textTransform: "none",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    margin: "0 10px 20px 0",
                }}
                onClick={props.onBack}
            >
                Return
            </Button>
        </Box>
    );


}

export default Chatbot;

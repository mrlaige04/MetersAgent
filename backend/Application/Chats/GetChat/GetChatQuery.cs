using Application.Abstractions;
using Application.Chats.Models;

namespace Application.Chats.GetChat;

public record GetChatQuery(int Id) : ICommand<ChatResponse>;
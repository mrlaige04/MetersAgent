using Application.Abstractions;
using Application.Models;

namespace Application.Chats.DeleteChat;

public record DeleteChatCommand(int Id) : ICommand<Success>;
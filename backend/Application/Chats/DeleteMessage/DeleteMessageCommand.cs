using Application.Abstractions;
using Application.Models;

namespace Application.Chats.DeleteMessage;

public record DeleteMessageCommand(int ChatId, int MessageId) : ICommand<Success>;
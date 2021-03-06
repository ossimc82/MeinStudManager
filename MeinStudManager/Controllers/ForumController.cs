using System.Net.Mime;
using System.Web;
using MeinStudManager.Data;
using MeinStudManager.Extensions;
using MeinStudManager.Models;
using MeinStudManager.Models.Forum;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MeinStudManager.Controllers
{
    public class ForumController : BasicAuthenticatedController
    {
        private readonly ForumManager forumManager;

        public ForumController(UserManager<ApplicationUser> userManager, ForumManager forumManager) : base(userManager)
        {
            this.forumManager = forumManager;
        }

        /// <summary>
        /// Lists all topics in the forum
        /// </summary>
        /// <param name="page">The requested page.</param>
        /// <returns></returns>
        /// <response code="200">If the request was successful.</response>
        [HttpGet("list")]
        [ProducesResponseType(typeof(PagingResult<ForumTopic>), StatusCodes.Status200OK)]
        public async Task<PagingResult<ForumTopic>> ListAllTopics([FromQuery]int page=1)
        {
            return forumManager.GetTopics(20, page, await GetUser());
        }

        /// <summary>
        /// Creates a new topic.
        /// </summary>
        /// <returns></returns>
        /// <response code="200">If the topic was created successful. Containing the new topic id</response>
        [HttpPost("new")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(Guid), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateNewTopic([FromBody] ForumPostDto data)
        {
            return await forumManager.NewTopic(await GetUser(), data.Title, data.Content, data.Anonymous);
        }

        /// <summary>
        /// Lists all replies in a topic.
        /// </summary>
        /// <param name="topicId">The id of the topic.</param>
        /// <param name="page">The requested page.</param>
        /// <param name="count">The amount of replies to be listed.</param>
        /// <returns></returns>
        /// <response code="200">If the request was successful.</response>
        [ProducesResponseType(typeof(PagingResult<ForumReply>), StatusCodes.Status200OK)]
        [HttpGet("topic/{topicId:guid}")]
        public async Task<PagingResult<ForumReply>> ListAllPostsInTopic([FromRoute] Guid topicId, [FromQuery]int page=1, [FromQuery] int count=20)
        {
            var user = await GetUser();
            var replies = forumManager.GetReplies(topicId, count, page, user);
            foreach (var repliesItem in replies.Items)
                repliesItem.Requester = user;

            return replies;
        }

        /// <summary>
        /// Posts a new reply in the topic.
        /// </summary>
        /// <param name="topicId">The id of the topic.</param>
        /// <returns></returns>
        /// <response code="200">If the reply was successfully placed.</response>
        [HttpPost("topic/{topicId}/new")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public async Task<IActionResult> PostNewReply([FromRoute] Guid topicId, [FromBody] ForumPostDto data)
        {
            var result = await forumManager.NewReply(topicId, await GetUser(), data.Title, data.Content, data.Anonymous);
            return result == null ? Ok("Success").AsJson() : Problem(result);
        }

        /// <summary>
        /// Edits a reply in the topic.
        /// </summary>
        /// <param name="topicId">The id of the topic.</param>
        /// <param name="postId">The id of the reply to edit.</param>
        /// <returns></returns>
        /// <response code="200">If the edit was successful.</response>
        [HttpPut("topic/{topicId}/edit/{postId}")]
        [Consumes(MediaTypeNames.Application.Json)]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public async Task<IActionResult> EditPost([FromRoute] Guid topicId, [FromRoute] Guid postId, [FromBody] ForumPostDto data)
        {
            var result = await forumManager.EditReply(topicId, postId, await GetUser(), data.Title, data.Content, data.Anonymous);
            return result == null ? Ok("Success").AsJson() : Problem(result);
        }

        /// <summary>
        /// Deletes a reply in a topic.
        /// NOTE: Only moderators and admins can delete replies!!!
        /// </summary>
        /// <param name="topicId">The id of the topic.</param>
        /// <param name="postId">The id of the reply to delete.</param>
        /// <returns></returns>
        /// <response code="200">If the reply was delete successful.</response>
        [HttpDelete("topic/{topicId}/delete/{postId}")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeletePost([FromRoute] Guid topicId, [FromRoute] Guid postId)
        {
            var result = await forumManager.DeletePost(topicId, postId, await GetUser());
            return result == null ? Ok("Success").AsJson() : Problem(result);
        }

        /// <summary>
        /// Upvotes a reply.
        /// </summary>
        /// <param name="topicId">The id of the topic.</param>
        /// <param name="postId">The id of the reply to vote up.</param>
        /// <returns></returns>
        /// <response code="200">If the upvote was successful.</response>
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [HttpPost("topic/{topicId}/upVote/{postId}")]
        public async Task<IActionResult> VoteUp([FromRoute] Guid topicId, [FromRoute] Guid postId)
        {
            var result = await forumManager.Vote(topicId, postId, await GetUser(), ForumVoteType.Up);
            return result == null ? Ok("Success").AsJson() : Problem(result);
        }

        /// <summary>
        /// Downvotes a reply.
        /// </summary>
        /// <param name="topicId">The id of the topic.</param>
        /// <param name="postId">The id of the reply to vote down.</param>
        /// <returns></returns>
        /// <response code="200">If the downvote was successful.</response>
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [HttpPost("topic/{topicId}/downVote/{postId}")]
        public async Task<IActionResult> VoteDown([FromRoute] Guid topicId, [FromRoute] Guid postId)
        {
            var result = await forumManager.Vote(topicId, postId, await GetUser(), ForumVoteType.Down);
            return result == null ? Ok("Success").AsJson() : Problem(result);
        }

        /// <summary>
        /// Removes a vote from a reply.
        /// </summary>
        /// <param name="topicId">The id of the topic.</param>
        /// <param name="postId">The id of the reply of the vote.</param>
        /// <returns></returns>
        /// <response code="200">If the vote was delete successful.</response>
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [HttpPost("topic/{topicId}/removeVote/{postId}")]
        public async Task<IActionResult> RemoveVote([FromRoute] Guid topicId, [FromRoute] Guid postId)
        {
            var result = await forumManager.RemoveVote(topicId, postId, await GetUser());
            return result == null ? Ok("Success").AsJson() : Problem(result);
        }
    }
}

/*!
 * Discord Widget
 * Lightweight embeddable Discord server widget
 * https://github.com/matthew2d/discord-widget
 * MIT License
 */
(function(global) {
    'use strict';

    /**
     * Initialize Discord Widgets
     * @param {Object} userConfig - Widget configuration overrides
     */
    function initDiscordWidgets(userConfig = {}) {
        // Default config, overridable by userConfig
        const defaultConfig = {
            selector: '.discord-widget',
            contentSelector: '.discord-content',
            showChannels: true,
            hideAllChannels: false,
            channelsAlphabetical: false,
            showMembers: true,
            membersCollapsible: true,
            membersCollapsedByDefault: false,
            customInviteURL: '', // fallback to Discord API invite if blank
            membersListAlwaysScrollable: false,
            showPresenceCountOutside: false,
            showOnlineMore: true,
            maxDisplayedMembers: 20,
            serverId: '', // REQUIRED: Discord server ID
            joinButtonText: 'Join Server',
            filterUserPattern: /^[a-zA-Z]\.\.\.$/ // Filter out usernames like "a..."
        };

        const config = Object.assign({}, defaultConfig, userConfig);

        // Helper functions
        function escapeHTML(str) {
            if (!str) return '';
            return String(str).replace(/[&<>"'`=\/]/g, s => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '`': '&#96;',
                '=': '&#61;',
                '/': '&#47;'
            } [s]));
        }

        function getChannelIcon(type) {
            // Emoji for cross-platform compatibility
            return type === "voice" ? `<span aria-label="voice" title="Voice Channel">🔊</span>` : `<span aria-label="text" title="Text Channel">#</span>`;
        }

        function sortChannels(channels) {
            if (!Array.isArray(channels)) return [];
            return config.channelsAlphabetical ? channels.slice().sort((a, b) => a.name.localeCompare(b.name)) : channels.slice().sort((a, b) => a.position - b.position);
        }

        function updatePresenceCountOutside(presenceCount) {
            if (!config.showPresenceCountOutside) return;
            const extOnlineSpan = document.querySelector('.discord-online-count');
            if (extOnlineSpan) {
                extOnlineSpan.innerHTML = `<span style="color:limegreen;">●</span> ${presenceCount} online`;
                extOnlineSpan.classList.add("discord-online");
                extOnlineSpan.classList.remove("discord-offline");
            }
        }

        function renderChannelsSection(channels) {
            if (config.hideAllChannels || !config.showChannels) return '';
            const channelsHtml = channels.length > 0 ? channels.map(ch => `
          <div class="discord-channel" title="${escapeHTML(ch.name)}">
            ${getChannelIcon(ch.type)}
            <span class="discord-channel-name">${escapeHTML(ch.name)}</span>
          </div>
        `).join('') : '<span class="discord-empty">No channels found.</span>';

            return `
        <div class="discord-section">
          <div class="discord-section-title">Channels</div>
          <div class="discord-channels-list">${channelsHtml}</div>
        </div>
      `;
        }

        function renderMembersSection(onlineMembers, presenceCount) {
            if (!config.showMembers || config.maxDisplayedMembers == 0) return '';
            let membersListClass = 'discord-members-list';
            if (config.membersListAlwaysScrollable) {
                membersListClass += ' discord-members-list-scroll';
            }
            const listInitialClass = config.membersCollapsible ? (config.membersCollapsedByDefault ? 'collapsed' : 'expanded') : 'expanded';

            const membersHtml = onlineMembers.length > 0 ? onlineMembers.slice(0, config.maxDisplayedMembers).map(member => `
            <div class="discord-member" title="${escapeHTML(member.username)}">
              <img class="discord-member-avatar" src="${member.avatar_url}" alt="${escapeHTML(member.username)}" />
              <span class="discord-member-name">${escapeHTML(member.username)}</span>
            </div>
          `).join('') : '<span class="discord-empty">No members online.</span>';

            const moreMembersNotice = (config.showOnlineMore && config.showMembers && config.maxDisplayedMembers > 0 && presenceCount > config.maxDisplayedMembers) ? `<span style="margin-left:5px;">+${(presenceCount - config.maxDisplayedMembers).toLocaleString()} more...</span>` : '';

            if (config.membersCollapsible) {
                return `
          <div class="discord-members-section">
            <div class="discord-members-header collapsible-header" style="user-select:none;cursor:pointer;">
              <span class="discord-section-title">Online Members</span>
              <span class="discord-members-toggle">${config.membersCollapsedByDefault ? '&#9654;' : '&#9660;'}</span>
            </div>
            <div class="${membersListClass} ${listInitialClass}">
              ${membersHtml}
              ${moreMembersNotice}
            </div>
          </div>
        `;
            } else {
                return `
          <div class="discord-members-section">
            <div class="discord-section-title" style="padding:14px 0 4px 0;">Online Members</div>
            <div class="${membersListClass}">
              ${membersHtml}
              ${moreMembersNotice}
            </div>
          </div>
        `;
            }
        }

        function renderStatsSection(onlineCount, presenceCount) {
            if (config.showPresenceCountOutside) return '';
            const onlineClass = onlineCount > 0 ? 'discord-online' : 'discord-offline';
            return `
        <div class="discord-stats-section">
          <div class="discord-stats">
            <span title="Online members" class="${onlineClass}">
              <span style="color:limegreen;">●</span> ${presenceCount} online
            </span>
          </div>
        </div>
      `;
        }

        function renderInviteButton(inviteURL) {
            return `
        <a class="discord-invite-btn" href="${inviteURL}" target="_blank" rel="noopener">
          ${escapeHTML(config.joinButtonText)}
        </a>
      `;
        }

        function initMembersCollapseToggle(widgetWrapper) {
            if (!config.showMembers || !config.membersCollapsible) return;
            const header = widgetWrapper.querySelector('.collapsible-header');
            const list = widgetWrapper.querySelector('.discord-members-list');
            const toggle = header ? header.querySelector('.discord-members-toggle') : null;
            if (!header || !list || !toggle) return;
            let expanded = !config.membersCollapsedByDefault;

            header.addEventListener('click', () => {
                expanded = !expanded;
                list.classList.toggle('expanded', expanded);
                list.classList.toggle('collapsed', !expanded);
                toggle.innerHTML = expanded ? '&#9660;' : '&#9654;';
                toggle.classList.toggle('collapsed', !expanded);
            });
        }

        // === Main logic for each widget instance ===
        document.querySelectorAll(config.selector).forEach(widgetWrapper => {
            const widget = widgetWrapper.querySelector(config.contentSelector);
            if (!widget) return;
            widget.textContent = 'Loading server info...';

            if (!config.serverId) {
                widget.innerHTML = `<div class="discord-error">No server ID provided.</div>`;
                return;
            }
            const API_URL = `https://discord.com/api/servers/${config.serverId}/embed.json`;

            fetch(API_URL)
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch Discord API');
                    return response.json();
                })
                .then(data => {
                    const apiInvite = data.instant_invite || '#';
                    const invite = config.customInviteURL.trim() || apiInvite;
                    const members = data.members || [];
                    const onlineMembers = members
                        .filter(m => ['online', 'idle', 'dnd'].includes(m.status))
                        .filter(m => !(config.filterUserPattern && config.filterUserPattern.test(m.username)));
                    const presenceCount = data.presence_count ?? onlineMembers.length;
                    const sortedChannels = sortChannels(data.channels || []);

                    updatePresenceCountOutside(presenceCount);

                    const channelsSectionHtml = renderChannelsSection(sortedChannels);
                    const membersSectionHtml = renderMembersSection(onlineMembers, presenceCount);
                    const statsSectionHtml = renderStatsSection(onlineMembers.length, presenceCount);
                    const inviteButtonHtml = renderInviteButton(invite);

                    widget.innerHTML = `${channelsSectionHtml}${membersSectionHtml}${statsSectionHtml}${inviteButtonHtml}`;
                    initMembersCollapseToggle(widgetWrapper);
                })
                .catch(error => {
                    widget.innerHTML = `<div class="discord-error">Could not load server info.<br>${escapeHTML(error.message)}</div>`;
                });
        });
    }

    // Expose to global
    global.initDiscordWidgets = initDiscordWidgets;

})(typeof window !== 'undefined' ? window : this);

// Usage example (in your site/app):
// <div class="discord-widget"><div class="discord-content"></div></div>
// <script src="discord-widget.js"></script>
// <script>
//   initDiscordWidgets({
//     serverId: 'YOUR_SERVER_ID',
//     // ...other options as needed
//   });
// </script>

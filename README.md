# Discord Server Widget

Embed a lightweight, customizable Discord server widget on any website.  
No third-party dependencies, simple setup, fully customizable look and behavior.

---

## Features

- ✅ **Easy to embed**: just add a `<div>` and initialize with your Discord Server ID
- ✅ **No dependencies**: pure JavaScript, works in all modern browsers
- ✅ **Shows channels and online members** (with avatars)
- ✅ **Customizable**: hide channels or members, set max displayed users, button text, etc.
- ✅ **Collapsible member list** for compact UI
- ✅ **Invite button** links to your server
- ✅ **Style however you want** with your own CSS

---

## Installation

1. **Download** [`discord-widget.js`](discord-widget.js) and include it in your site.

   ```html
   <script src="discord-widget.js"></script>
   <div class="discord-widget">
      <div class="discord-content"></div>
   </div>

   <script>
      initDiscordWidgets({
        serverId: 'YOUR_SERVER_ID' // Replace with your actual Discord Server ID
        // Other options can go here!
      });
   </script>

## Configuration Options
All options are optional except serverId.

| Option                        | Type    | Default              | Description                                                 |
| ----------------------------- | ------- | -------------------- | ----------------------------------------------------------- |
| `selector`                    | string  | `.discord-widget`    | Widget container selector                                   |
| `contentSelector`             | string  | `.discord-content`   | Selector for inner content area                             |
| `showChannels`                | boolean | `true`               | Show channels section                                       |
| `hideAllChannels`             | boolean | `false`              | Hide all channels, even if `showChannels` is `true`         |
| `channelsAlphabetical`        | boolean | `false`              | Sort channels alphabetically                                |
| `showMembers`                 | boolean | `true`               | Show online members section                                 |
| `membersCollapsible`          | boolean | `true`               | Make member list collapsible                                |
| `membersCollapsedByDefault`   | boolean | `false`              | Start member list collapsed                                 |
| `customInviteURL`             | string  | `''`                 | Custom invite URL for the "Join" button                     |
| `membersListAlwaysScrollable` | boolean | `false`              | Member list is always scrollable                            |
| `showPresenceCountTitle`      | boolean | `false`              | Show presence count outside the widget (see below)          |
| `showOnlineMore`              | boolean | `true`               | Show "+N more" if member count exceeds limit                |
| `maxDisplayedMembers`         | number  | `20`                 | Maximum number of online members shown                      |
| `serverId`                    | string  | *(required)*         | Your Discord server's ID (see below)                        |
| `joinButtonText`              | string  | `"Join Server"`      | Text for the join/invite button                             |
| `filterUserPattern`           | RegExp  | `/^[a-zA-Z]\.\.\.$/` | RegExp for filtering out bot usernames or specific patterns |

```html
<script>
initDiscordWidgets({
  serverId: '123456789012345678',
  maxDisplayedMembers: 10,
  showChannels: true,
  joinButtonText: "Join our Community"
});
</script>
```

## How do I find my Discord Server ID?

1. Go to your Discord server in the Discord app or web client.
2. Right-click on the server icon and select "Copy Server ID".  
   *If you don’t see this, enable Developer Mode in Discord’s settings (under Advanced).*

## Custom Styling

This widget ships with no CSS, so you can style it any way you like!
Here’s a quick example to get you started:

```
.discord-widget {
  border: 1px solid #5865f2;
  border-radius: 8px;
  max-width: 340px;
  background: #23272a;
  color: #fff;
  font-family: 'Segoe UI', Arial, sans-serif;
  overflow: hidden;
}

.discord-section-title { font-weight: bold; margin-bottom: 6px; }
.discord-channel, .discord-member { display: flex; align-items: center; margin-bottom: 6px; }
.discord-channel-name, .discord-member-name { margin-left: 8px; }
.discord-member-avatar { border-radius: 50%; width: 32px; height: 32px; }
.discord-invite-btn {
  display: block; text-align: center; margin: 14px 0; padding: 10px;
  background: #5865f2; color: #fff; border-radius: 4px; text-decoration: none;
  font-weight: bold; transition: background 0.2s;
}
.discord-invite-btn:hover { background: #4752c4; }
.discord-members-list.collapsed { display: none; }
```

## presence_count Outside the Widget

If you want to display the online count outside the widget (e.g., in a header),
add an element like this somewhere else on your page:

```
<span class="discord-online-count"></span>
```

Then use this option:
```
initDiscordWidgets({
  serverId: 'YOUR_SERVER_ID',
  showPresenceCountOutside: true
});
```

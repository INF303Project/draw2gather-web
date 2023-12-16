<script lang="ts">
    // export let type: string;
    export let user: string;
    export let message: string;
</script>

<div id="message">
    <span id="user">{user}:</span>
    <span id="msg">{message}</span>
</div>

<style>
    #message {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    #message #user {
        font-weight: bold;
        margin-right: 0.5rem;
    }
</style>

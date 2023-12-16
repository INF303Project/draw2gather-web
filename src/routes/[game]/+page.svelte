<script lang="ts">
    import AnswerBox from "$lib/components/AnswerBox.svelte";
    import Board from "$lib/components/Board.svelte";
    import ChatBox from "$lib/components/ChatBox.svelte";
    import HorTools from "$lib/components/HorTools.svelte";
    import PlayerList from "$lib/components/PlayerList.svelte";
    import Tools from "$lib/components/Tools.svelte";
    import type { PageData } from "./$types";

    // export let data: PageData;

    const swapChat = () => {
        const answers = document.getElementById("answers");
        const chat = document.getElementById("chat");
        if (answers && chat) {
            answers.classList.toggle("d-none");
            chat.classList.toggle("d-none");
        }
    };
</script>

<div id="game" class="container-lg">
    <div class="row d-none d-md-flex align-items-center text-center">
        <h3>Draw2Gather</h3>
    </div>

    <div class="row h-100" style="overflow: hidden;">
        <div
            class="d-none d-md-flex justify-content-center align-items-start col-md-3 h-100"
        >
            <div class="col h-100">
                <PlayerList />
            </div>
            <div class="col h-100" style="overflow: auto;">
                <Tools />
            </div>
        </div>
        <div
            class="d-flex flex-column col-12 col-md-9 h-100"
            style="row-gap: 1rem;"
        >
            <div class="row">
                <Board />
            </div>
            <div class="row d-flex d-md-none d-none">
                <HorTools />
            </div>
            <div
                class="row justify-content-center h-100"
                style="overflow: hidden;"
            >
                <div class="d-flex d-md-none col-4 h-100">
                    <PlayerList />
                </div>
                <div id="answers" class="d-flex d-md-flex col-8 col-md-6 h-100">
                    <AnswerBox on:swap={swapChat} />
                </div>
                <div id="chat" class="d-none d-md-flex col-8 col-md-6 h-100">
                    <ChatBox on:swap={swapChat} />
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    #game {
        display: flex;
        flex-direction: column;

        height: 100%;

        padding-top: 1rem;
        padding-bottom: 1rem;
    }
</style>

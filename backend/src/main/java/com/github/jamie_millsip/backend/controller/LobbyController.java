package com.github.jamie_millsip.backend.controller;

import com.github.jamie_millsip.backend.model.DTO.*;
import com.github.jamie_millsip.backend.model.Lobby;
import com.github.jamie_millsip.backend.model.Player;
import com.github.jamie_millsip.backend.model.SharedService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.text.DecimalFormat;
import java.util.*;
import java.util.regex.Pattern;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class LobbyController {

    @Autowired
    private SharedService sharedService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    List<Lobby> lobbyList;

    @PostConstruct
    public void init() {
        lobbyList = sharedService.getLobbyList();
    }



    public void triggerBroadcast(String lobbyID, LobbySocketResponse response){
        System.out.println("Broadcast Triggered");
        messagingTemplate.convertAndSend("/topic/" + lobbyID, response);
    }

    public void triggerGameBroadcast(String lobbyID, GameSocketResponse response){
        System.out.println("Broadcast Triggered");
        messagingTemplate.convertAndSend("/topic/game/" + lobbyID, response);
    }

    @RequestMapping("/verifyHomePageData")
    public int LobbyExists(@RequestBody Lobby lobby) {
        if (lobby == null || lobby.getId()== null) return 2;
        if(!Pattern.matches("[0-9]+", lobby.getId()) || lobby.getId().length() != 5) return 2;
        for (Lobby l : lobbyList) {
            if (l.getId().equals(lobby.getId())) {
                return 3;
            }
        }
        return 0;
    }

    @RequestMapping("/addPlayer")
    public int AddPlayer(@RequestBody ReadyUpPost request){
        String lobbyID = request.getLobbyID();
        Player player = request.getPlayer();
        boolean availableName = true;
        for (Lobby l : lobbyList) {
            if (l.getId().equals(lobbyID)) {
                for (Player p : l.getAllPlayers()){
                    if (Objects.equals(p.getNickname(), player.getNickname())){
                        availableName = false;
                        break;
                    }
                }
                if (availableName){
                    l.addPlayer(player);
                    break;
                }
                else{
                    return 0;
                }
            }
        }
        PlayerReady[] playersArray = getPlayersReady(lobbyID);
        triggerBroadcast(lobbyID, new LobbySocketResponse("playerNames", playersArray));
        return 1;
    }

    @RequestMapping("/lobbyReadyUp")
    public void lobbyReadyUp(@RequestBody ReadyUpPost request){
        System.out.println("entering readyup place");
        String lobbyID = request.getLobbyID();
        String nickname = request.getPlayer().getNickname();
        Lobby lobby = null;
        for (Lobby l : lobbyList) {
            if (l.getId().equals(lobbyID)) {
                lobby = l;
                l.getPlayer(nickname).setLobbyReady(!l.getPlayer(nickname).getLobbyReady());
                break;
            }
        }
        PlayerReady[] playersArray = getPlayersReady(lobbyID);
        triggerBroadcast(lobbyID, new LobbySocketResponse("playerNames", playersArray));
        checkEnterGameView(lobby);
    }


    public void checkEnterGameView(Lobby lobby){
        boolean allReadyUp = true;
        int playerCount = 0;
        playerCount = lobby.getAllPlayers().size();
        for(Player p : lobby.getAllPlayers()){
            if (!p.getLobbyReady()){
            allReadyUp = false;
            break;
            }
        }
        if (allReadyUp && playerCount > 1) {
            enterGameView(lobby);
        }
    }

    public void enterGameView(Lobby lobby){
        lobby.initCards();
        for (Player p : lobby.getAllPlayers()) {
            p.setLobbyReady(false);
        }
        triggerBroadcast(lobby.getId(), new LobbySocketResponse("enterGameView", getPlayersReady(lobby.getId())));
    }

    @RequestMapping("/gameReadyUp")
    public void gameReadyUp(@RequestBody ReadyUpPost request){
        System.out.println("entering readyup place");
        String lobbyID = request.getLobbyID();
        String nickname = request.getPlayer().getNickname();
        Lobby lobby = null;
        for (Lobby l : lobbyList) {
            if (l.getId().equals(lobbyID)) {
                lobby = l;
                l.getPlayer(nickname).setGameReady(!l.getPlayer(nickname).getGameReady());
                break;
            }
        }
        checkStartGame(lobby);
    }

    public void checkStartGame(Lobby lobby){
        boolean allReadyUp = true;
        for(Player p : lobby.getAllPlayers()){
            if (!p.getGameReady()){
                allReadyUp = false;
                break;
            }
        }
        if (allReadyUp) {
            for (Player p : lobby.getAllPlayers()) {
                p.setGameReady(false);
            }
            triggerGameBroadcast(lobby.getId(), new GameSocketResponse("gameStart", ""));
        }
    }

    @RequestMapping("/getCards/{lobbyID}")
    public getCardsResponse getCards(@PathVariable String lobbyID){
        for (Lobby l : lobbyList){
            if (l.getId().equals(lobbyID)){
                return new getCardsResponse(l.getCards());
            }
        }
        return null;
    }


    @RequestMapping("/getThisUserIndex/{lobbyID}")
    public int getPlayerIndex(@PathVariable String lobbyID, @RequestBody nicknameInput request){
        for (Lobby l : lobbyList) {
            if (l.getId().equals(lobbyID)) {
                for (int i = 0; i < l.getAllPlayers().size(); i++) {
                    if (l.getPlayer(i).getNickname().equals(request.getNickname())) {
                        return i;
                    }
                }
            }
        }
        return -1;
    }


    @RequestMapping("/createLobby")
    public String createLobby(){
        Random random = new Random();
        DecimalFormat codeFormat = new DecimalFormat("00000");
        int lobbyCode = random.nextInt(100000);
        String lobbyID = codeFormat.format(lobbyCode);
        Lobby lobby = new Lobby(lobbyID);
        lobbyList.add(lobby);
        return lobby.getId();
    }


        @PostMapping(value = "/removePlayer/{lobbyID}")
        public void removeUser(@PathVariable String lobbyID, @RequestBody String nickname){
            boolean lobbyExists = false;
            for (Lobby l : lobbyList) {
                if (l.getId().equals(lobbyID)) {
                    lobbyExists = true;
                    l.removePlayer(l.getPlayer(nickname));
                    break;
                }
            }
            if (!lobbyExists) {
                System.out.println("no lobby smh");
                return;
            }
            PlayerReady[] playersArray = getPlayersReady(lobbyID);
            triggerBroadcast(lobbyID, new LobbySocketResponse("removedPlayer", playersArray));
        }

        @MessageMapping("/backend/{lobbyID}")
        @SendTo("/topic/{lobbyID}")
        public LobbySocketResponse lobbyReady(@DestinationVariable String lobbyID) {
            PlayerReady[] playersArray = getPlayersReady(lobbyID);
            return new LobbySocketResponse("playerNames", playersArray);
        }


        public PlayerReady[] getPlayersReady(String lobbyID){
            ArrayList<PlayerReady> players = new ArrayList<>();
            for (Lobby l : lobbyList){
                if (l.getId().equals(lobbyID)){
                    for (Player p : l.getAllPlayers()){
                        players.add(new PlayerReady(p.getNickname(), p.getLobbyReady()));
                    }
                    break;
                }
            }
            return players.toArray(new PlayerReady[players.size()]);
        }

}
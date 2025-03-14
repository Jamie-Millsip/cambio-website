package com.github.jamie_millsip.backend.model;


import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SharedService {

    private List<Lobby> lobbyList = new ArrayList<Lobby>();

    public List<Lobby> getLobbyList() {
        return lobbyList;
    }

    public void setLobbyList(List<Lobby> lobbyList) {
        this.lobbyList = lobbyList;
    }
}

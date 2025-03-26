package com.github.jamie_millsip.backend.model;

public class PlayerReady {

    private String nickname;
    private boolean ready;

    public PlayerReady(String nickname, boolean ready) {
        this.nickname = nickname;
        this.ready = ready;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public boolean getReady() {
        return ready;
    }

    public void setReady(boolean ready) {
        this.ready = ready;
    }
}


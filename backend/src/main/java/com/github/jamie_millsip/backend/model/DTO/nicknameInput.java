package com.github.jamie_millsip.backend.model.DTO;

import com.fasterxml.jackson.annotation.JsonCreator;

public class nicknameInput {

    private String nickname;


    @JsonCreator
    public nicknameInput(String nickname) {
        this.nickname = nickname;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
}

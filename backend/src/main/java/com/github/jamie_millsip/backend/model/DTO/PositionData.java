package com.github.jamie_millsip.backend.model.DTO;

public class PositionData {

    private int player;
    private int row;
    private int column;

    public PositionData(int player, int row, int column) {
        this.player = player;
        this.row = row;
        this.column = column;
    }

    public int getPlayer() {
        return player;
    }

    public void setPlayer(int player) {
        this.player = player;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getColumn() {
        return column;
    }

    public void setColumn(int column) {
        this.column = column;
    }


}
